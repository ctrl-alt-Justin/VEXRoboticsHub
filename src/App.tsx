import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, UserCircle, Lightbulb, Wrench, Code, BookOpen, Github, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

function App() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 150 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX - 200);
            mouseY.set(e.clientY - 200);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-red-500/30 overflow-hidden relative">
            {/* Animated Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <motion.div
                    style={{ x: springX, y: springY }}
                    className="absolute w-[400px] h-[400px] bg-red-500/20 rounded-full blur-[100px] mix-blend-screen"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                        rotate: [0, 90, 0]
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-red-500/10 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.2, 0.4, 0.2],
                        x: [0, 100, 0]
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-[20%] -right-[20%] w-[60vw] h-[60vw] bg-orange-500/10 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.4, 0.2],
                        y: [0, -50, 0]
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute -bottom-[20%] left-[20%] w-[50vw] h-[50vw] bg-yellow-500/10 rounded-full blur-[120px]"
                />
            </div>

            {/* Navigation - Fully Transparent */}
            <nav className="fixed w-full z-50 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 text-xl font-bold"
                    >
                        <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">VEX</span>
                        </div>
                        <span>VEX Robotics Hub</span>
                    </motion.div>
                    <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
                        <a href="#roles" className="hover:text-white transition-colors">Roles</a>
                        <a href="#about" className="hover:text-white transition-colors">About</a>
                        <Link to="/signin">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-4 py-2 bg-white text-black rounded-full font-medium hover:bg-gray-100 transition-colors"
                            >
                                Sign In
                            </motion.button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial="initial"
                        animate="animate"
                        variants={staggerContainer}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <motion.div
                            variants={fadeIn}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-red-400 mb-8 backdrop-blur-sm"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            Invite Only
                        </motion.div>

                        <motion.h1
                            variants={fadeIn}
                            className="text-5xl md:text-7xl font-bold tracking-tight mb-8"
                        >
                            Welcome to the <br />
                            <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                                VEX Robotics Hub.
                            </span>
                        </motion.h1>

                        <motion.p
                            variants={fadeIn}
                            className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
                        >
                            An exclusive workspace for selected members. Join your team, choose your role,
                            and collaborate on groundbreaking robotics projects.
                        </motion.p>

                        <motion.div
                            variants={fadeIn}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <Link to="/signup" className="w-full sm:w-auto">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full font-medium hover:from-red-600 hover:to-orange-600 transition-colors flex items-center gap-2 w-full justify-center shadow-lg shadow-red-500/20"
                                >
                                    Sign Up <ArrowRight className="w-4 h-4" />
                                </motion.button>
                            </Link>
                            <Link to="/signin" className="w-full sm:w-auto">
                                <motion.button
                                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-full font-medium transition-colors w-full backdrop-blur-sm"
                                >
                                    Sign In
                                </motion.button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Roles Section */}
            <section id="roles" className="py-24 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Role</h2>
                        <p className="text-gray-400">Select the role that best fits your expertise and passion.</p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="grid md:grid-cols-3 gap-6"
                    >
                        {[
                            {
                                icon: <UserCircle className="w-6 h-6" />,
                                title: "Coach",
                                desc: "Lead and mentor the team, strategize competitions, and guide overall direction.",
                                iconBg: "bg-blue-500/10",
                                iconColor: "text-blue-400",
                                borderColor: "hover:border-blue-500/50"
                            },
                            {
                                icon: <Lightbulb className="w-6 h-6" />,
                                title: "Adviser",
                                desc: "Provide strategic insights, problem-solving expertise, and technical guidance.",
                                borderColor: "hover:border-green-500/50"
                            },
                            {
                                icon: <Code className="w-6 h-6" />,
                                title: "Programmer",
                                desc: "Write autonomous code, tune sensors, and optimize robot performance.",
                                iconBg: "bg-purple-500/10",
                                iconColor: "text-purple-400",
                                borderColor: "hover:border-purple-500/50"
                            },
                            {
                                icon: <BookOpen className="w-6 h-6" />,
                                title: "Notebook",
                                desc: "Document progress, maintain engineering records, and prepare presentations.",
                                iconBg: "bg-red-500/10",
                                iconColor: "text-red-400",
                                borderColor: "hover:border-red-500/50"
                            }
                        ].map((role, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5 }}
                                className={`p-8 rounded-2xl bg-white/5 border border-white/10 ${role.borderColor} transition-colors backdrop-blur-sm`}
                            >
                                <div className={`mb-4 p-3 ${role.iconBg} rounded-lg w-fit`}>
                                    <div className={role.iconColor}>{role.icon}</div>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{role.title}</h3>
                                <p className="text-gray-400">{role.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-white/5 relative z-10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-gray-400 text-sm">
                        © 2024 VEX Robotics Hub. All rights reserved.
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: any) {
        return { hasError: true, error };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-10 text-red-500">
                    <h1>Something went wrong.</h1>
                    <pre>{this.state.error?.toString()}</pre>
                </div>
            );
        }

        return this.props.children;
    }
}

export default function AppWrapper() {
    return (
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    );
}
