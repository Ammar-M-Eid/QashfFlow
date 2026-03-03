"""
Quantum Machine Learning Model Architecture
Extracted from 5photons_Hybrid_Quantum_TCN notebook
"""
import torch
import torch.nn as nn
from math import comb

try:
    from merlin import (
        QuantumLayer,
        MeasurementStrategy,
        ComputationSpace,
    )
    import perceval as pcvl
    QUANTUM_AVAILABLE = True
except ImportError:
    QUANTUM_AVAILABLE = False
    print("Warning: Merlin/Perceval not available. Quantum layers will be disabled.")


class ScaleLayer(nn.Module):
    """Scale input values to appropriate range for quantum circuit"""
    def __init__(self, dim, scale_type="learned"):
        super().__init__()
        if scale_type == "learned":
            self.scale = nn.Parameter(torch.full((dim,), 0.1))
        elif scale_type == "pi":
            self.scale = torch.full((dim,), torch.pi)
        elif scale_type == "2pi":
            self.scale = torch.full((dim,), 2 * torch.pi)
        else:
            self.scale = torch.full((dim,), 1.0)

    def forward(self, x):
        return x * self.scale


class Chomp1d(nn.Module):
    """Chomp1d module for causal convolutions"""
    def __init__(self, chomp_size):
        super().__init__()
        self.chomp_size = chomp_size

    def forward(self, x):
        return x[:, :, :-self.chomp_size].contiguous()


class TemporalBlock(nn.Module):
    """Temporal Block for TCN"""
    def __init__(self, n_inputs, n_outputs, kernel_size, stride, dilation, padding, dropout=0.2):
        super().__init__()

        self.conv1 = nn.Conv1d(
            n_inputs, n_outputs, kernel_size,
            stride=stride, padding=padding, dilation=dilation
        )
        self.chomp1 = Chomp1d(padding)
        self.relu1 = nn.ReLU()
        self.dropout1 = nn.Dropout(dropout)

        self.conv2 = nn.Conv1d(
            n_outputs, n_outputs, kernel_size,
            stride=stride, padding=padding, dilation=dilation
        )
        self.chomp2 = Chomp1d(padding)
        self.relu2 = nn.ReLU()
        self.dropout2 = nn.Dropout(dropout)

        self.net = nn.Sequential(
            self.conv1, self.chomp1, self.relu1, self.dropout1,
            self.conv2, self.chomp2, self.relu2, self.dropout2
        )

        self.downsample = nn.Conv1d(n_inputs, n_outputs, 1) if n_inputs != n_outputs else None
        self.relu = nn.ReLU()

    def forward(self, x):
        out = self.net(x)
        res = x if self.downsample is None else self.downsample(x)
        return self.relu(out + res)


class TemporalConvNet(nn.Module):
    """Temporal Convolutional Network"""
    def __init__(self, num_inputs, num_channels, kernel_size=3, dropout=0.2):
        super().__init__()

        layers = []
        num_levels = len(num_channels)

        for i in range(num_levels):
            dilation_size = 2 ** i
            in_channels = num_inputs if i == 0 else num_channels[i-1]
            out_channels = num_channels[i]

            layers.append(
                TemporalBlock(
                    in_channels, out_channels, kernel_size,
                    stride=1, dilation=dilation_size,
                    padding=(kernel_size - 1) * dilation_size,
                    dropout=dropout
                )
            )

        self.network = nn.Sequential(*layers)

    def forward(self, x):
        return self.network(x)


def create_circuit_general(modes=6):
    """Create a variational quantum circuit with specified number of modes"""
    if not QUANTUM_AVAILABLE:
        return None

    wl = pcvl.GenericInterferometer(
        modes,
        lambda i: (
            pcvl.BS(pcvl.P(f"theta_li{i}_bs"))
            // pcvl.PS(pcvl.P(f"theta_li_ps{i}"))
            // pcvl.BS(pcvl.P(f"theta_lo{i}_bs"))
            // pcvl.PS(pcvl.P(f"theta_lo_ps{i}"))
        ),
        shape=pcvl.InterferometerShape.RECTANGLE,
    )

    c_var = pcvl.Circuit(modes)
    for i in range(modes):
        px = pcvl.P(f"px{i}")
        c_var.add(i, pcvl.PS(px))

    wr = pcvl.GenericInterferometer(
        modes,
        lambda i: (
            pcvl.BS(pcvl.P(f"theta_ri{i}_bs"))
            // pcvl.PS(pcvl.P(f"theta_ri{i}_ps"))
            // pcvl.BS(pcvl.P(f"theta_ro{i}_bs"))
            // pcvl.PS(pcvl.P(f"theta_ro{i}_ps"))
        ),
        shape=pcvl.InterferometerShape.RECTANGLE,
    )

    c = pcvl.Circuit(modes)
    c.add(0, wl, merge=True)
    c.add(0, c_var, merge=True)
    c.add(0, wr, merge=True)

    return c


class QuantumFinancialTCN(nn.Module):
    """
    Hybrid Quantum-Classical Model for Option Pricing using Temporal Convolutional Network
    Optimized with 3 photons for faster inference and serverless deployment
    """

    def __init__(self, n_features=200, q_modes=6, n_photons=3,
                 hidden_channels=[64, 128, 64], kernel_size=3, dropout=0.1):
        super().__init__()

        self.n_features = n_features
        self.q_modes = q_modes
        self.n_photons = n_photons
        self.hidden_channels = hidden_channels
        self.kernel_size = kernel_size
        self.dropout = dropout

        # Classical compression
        self.compressor = nn.Sequential(
            nn.Linear(n_features, 64),
            nn.ReLU(),
            nn.Linear(64, 32),
            nn.ReLU(),
            nn.Linear(32, q_modes),
            nn.Tanh()
        )

        # Scale layer
        self.scale_layer = ScaleLayer(q_modes, scale_type="learned")

        # Quantum layer (if available)
        if QUANTUM_AVAILABLE:
            circuit = create_circuit_general(modes=q_modes)
            input_state = [1] * n_photons + [0] * (q_modes - n_photons)

            self.quantum_layer = QuantumLayer(
                input_size=q_modes,
                circuit=circuit,
                trainable_parameters=["theta"],
                input_parameters=["px"],
                input_state=input_state,
                measurement_strategy=MeasurementStrategy.probs(
                    computation_space=ComputationSpace.FOCK
                )
            )

            self.quantum_output_size = comb(q_modes + n_photons - 1, n_photons)
        else:
            self.quantum_layer = None
            self.quantum_output_size = comb(q_modes + n_photons - 1, n_photons)

        # Combined feature size
        self.combined_size = n_features + self.quantum_output_size

        # Temporal Convolutional Network
        self.tcn = TemporalConvNet(
            num_inputs=self.combined_size,
            num_channels=hidden_channels,
            kernel_size=kernel_size,
            dropout=dropout
        )

        # Output projection
        self.output_projection = nn.Sequential(
            nn.Linear(hidden_channels[-1], hidden_channels[-1] // 2),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(hidden_channels[-1] // 2, n_features)
        )

        self._init_weights()
        self.device = None

    def _init_weights(self):
        for module in self.modules():
            if isinstance(module, nn.Linear):
                nn.init.xavier_uniform_(module.weight)
                if module.bias is not None:
                    nn.init.constant_(module.bias, 0)
            elif isinstance(module, nn.Conv1d):
                nn.init.kaiming_normal_(module.weight, mode='fan_in', nonlinearity='relu')
                if module.bias is not None:
                    nn.init.constant_(module.bias, 0)

    def to(self, device):
        self.device = device
        return super().to(device)

    def forward(self, x):
        if self.device is None:
            self.device = x.device

        batch_size, seq_len, _ = x.shape

        # Process each time step through quantum layer
        quantum_features = []
        for t in range(seq_len):
            x_t = x[:, t, :]
            x_compressed = self.compressor(x_t)
            x_scaled = self.scale_layer(x_compressed)

            if self.quantum_layer is not None:
                q_out = self.quantum_layer(x_scaled)
                q_out = q_out.to(self.device)
            else:
                # Fallback: deterministic feature expansion matching quantum output size
                base_features = torch.cat(
                    [
                        x_scaled,
                        torch.sin(x_scaled),
                        torch.cos(x_scaled),
                        x_scaled ** 2,
                        torch.sin(2 * x_scaled),
                        torch.cos(2 * x_scaled),
                    ],
                    dim=-1,
                )
                repeat_count = (self.quantum_output_size + base_features.shape[-1] - 1) // base_features.shape[-1]
                expanded = base_features.repeat(1, repeat_count)
                q_out = expanded[:, : self.quantum_output_size]

            quantum_features.append(q_out)

        quantum_stack = torch.stack(quantum_features, dim=1)
        quantum_stack = quantum_stack.to(self.device)

        # Combine classical and quantum features
        combined = torch.cat([x, quantum_stack], dim=-1)

        # TCN processing
        tcn_input = combined.transpose(1, 2)
        tcn_output = self.tcn(tcn_input)
        tcn_output = tcn_output.transpose(1, 2)

        # Generate predictions
        predictions = self.output_projection(tcn_output)

        return predictions
