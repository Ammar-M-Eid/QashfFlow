'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Github, Linkedin, Users } from 'lucide-react';

interface TeamMember {
    name: string;
    image?: string;
    linkedin?: string;
    github?: string;
}

const TEAM_MEMBERS: TeamMember[] = [
    {
        name: 'Ammar Mahmoud Eid',
        image: '/Ammar.jpg',
        linkedin: 'https://www.linkedin.com/in/ammar-m-eid/',
        github: 'https://github.com/Ammar-M-Eid/',
    },
    {
        name: 'Rana Saad',
        image: '/rana.jpeg',
        linkedin: 'https://www.linkedin.com/in/ranazsaad/',
        github: 'https://github.com/ranazsaad',
    },
    {
        name: 'Zeyad Ahmed',
        image: '/zeyad.jpeg',
        linkedin: 'https://www.linkedin.com/in/zeyad-ahmed-730002242/',
        github: 'https://github.com/zeyadahmedh/',
    },
    {
        name: 'Menna Allah Mohammed Zaied',
    },
];

export default function TeamSection() {
    return (
        <section className="container mx-auto px-4 py-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-purple-500/40 mb-4">
                    <Users className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-purple-300">Our Team</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold gradient-text">Meet the Team</h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {TEAM_MEMBERS.map((member, idx) => (
                    <motion.div
                        key={member.name}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1, duration: 0.5 }}
                        className="glass-card rounded-2xl p-6 flex flex-col items-center text-center glass-card-hover"
                    >
                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-purple-500/40">
                            {member.image ? (
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    width={96}
                                    height={96}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-2xl font-bold text-white">
                                    {member.name.charAt(0)}
                                </div>
                            )}
                        </div>

                        {/* Name */}
                        <h3 className="font-semibold text-base mb-3 leading-snug">{member.name}</h3>

                        {/* Social links */}
                        <div className="flex gap-3 mt-auto">
                            {member.linkedin && (
                                <a
                                    href={member.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 transition-colors"
                                    aria-label={`${member.name} on LinkedIn`}
                                >
                                    <Linkedin className="w-4 h-4 text-blue-400" />
                                </a>
                            )}
                            {member.github && (
                                <a
                                    href={member.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-lg bg-gray-600/20 hover:bg-gray-600/40 border border-gray-500/30 transition-colors"
                                    aria-label={`${member.name} on GitHub`}
                                >
                                    <Github className="w-4 h-4 text-gray-300" />
                                </a>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
