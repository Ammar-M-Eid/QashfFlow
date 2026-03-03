import math
from typing import Tuple


def _norm_cdf(x: float) -> float:
    return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))


def black_scholes_call_put(
    spot: float,
    strike: float,
    time_to_maturity: float,
    risk_free_rate: float,
    volatility: float,
) -> Tuple[float, float]:
    time_to_maturity = max(time_to_maturity, 1e-6)
    volatility = max(volatility, 1e-6)

    d1 = (
        math.log(max(spot, 1e-8) / max(strike, 1e-8))
        + (risk_free_rate + 0.5 * volatility**2) * time_to_maturity
    ) / (volatility * math.sqrt(time_to_maturity))
    d2 = d1 - volatility * math.sqrt(time_to_maturity)

    call = spot * _norm_cdf(d1) - strike * math.exp(-risk_free_rate * time_to_maturity) * _norm_cdf(d2)
    put = strike * math.exp(-risk_free_rate * time_to_maturity) * _norm_cdf(-d2) - spot * _norm_cdf(-d1)

    return max(call, 0.0), max(put, 0.0)
