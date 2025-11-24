import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, AlertCircle, UserCircle, Lightbulb, Gauge, Wrench, Code, BookOpen } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ROLES = [
    { id: 'coach', name: 'Coach', icon: UserCircle, color: 'blue' },
    { id: 'adviser', name: 'Adviser', icon: Lightbulb, color: 'yellow' },
    { id: 'driver', name: 'Driver', icon: Gauge, color: 'pink' },
    { id: 'builder', name: 'Builder', icon: Wrench, color: 'green' },
    { id: 'programmer', name: 'Programmer', icon: Code, color: 'purple' },
    { id: 'notebook', name: 'Notebook', icon: BookOpen, color: 'red' }
];

import { useAuth } from '../context/AuthContext';

export default function SignUp() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        accessCode: '',
        role: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { signup } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (step === 1) {
            // Validate access code
            if (formData.accessCode.toLowerCase() === 'tester') {
                setError('');
                setStep(2);
            } else {
                setError('Invalid access code. Please check and try again.');
            }
        } else if (step === 2) {
            // Validate other fields
            if (!formData.name || !formData.email || !formData.password) {
                setError('Please fill in all fields');
                return;
            }
            setError('');
            setStep(3);
        } else if (step === 3) {
            // Validate role selection
            if (!formData.role) {
                setError('Please select a role');
                return;
            }

            try {
                await signup(formData.name, formData.email, formData.role);
                navigate('/dashboard');
            } catch (err) {
                setError('Failed to create account. Please try again.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
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
            </div>

            {/* Sign Up Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl w-full bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 relative z-10"
            >
                <div className="mb-8 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold">VEX</span>
                    </div>
                    <h1 className="text-3xl font-bold">Join VEX Robotics Hub</h1>
                    <p className="text-gray-400 mt-2">Step {step} of 3</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-400">Access Code</span>
                        <span className="text-sm text-gray-400">Details</span>
                        <span className="text-sm text-gray-400">Role</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full">
                        <div
                            className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-300"
                            style={{ width: `${(step / 3) * 100}%` }}
                        />
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-400">
                        <AlertCircle className="w-5 h-5" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {step === 1 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Access Code
                                </label>
                                <input
                                    type="text"
                                    value={formData.accessCode}
                                    onChange={(e) => setFormData({ ...formData, accessCode: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                                    placeholder="Enter your access code"
                                    autoFocus
                                />
                                <p className="mt-2 text-sm text-gray-500">
                                    This is an invite-only workspace. Please enter the code provided to you.
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <p className="text-sm text-gray-400 mb-6">Select your role in the team:</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {ROLES.map((role) => (
                                    <motion.button
                                        key={role.id}
                                        type="button"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setFormData({ ...formData, role: role.id })}
                                        className={`p-6 rounded-xl border-2 transition-all ${formData.role === role.id
                                            ? `border-${role.color}-500 bg-${role.color}-500/10`
                                            : 'border-white/10 bg-white/5'
                                            }`}
                                    >
                                        <role.icon className={`w-8 h-8 mx-auto mb-2 ${formData.role === role.id ? `text-${role.color}-400` : 'text-gray-400'
                                            }`} />
                                        <p className="text-sm font-medium">{role.name}</p>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    <div className="flex items-center gap-4 mt-8">
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={() => setStep(step - 1)}
                                className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
                            >
                                Back
                            </button>
                        )}
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg font-medium hover:from-red-600 hover:to-orange-600 transition-colors flex items-center justify-center gap-2"
                        >
                            {step === 3 ? 'Complete Sign Up' : 'Continue'} <ArrowRight className="w-4 h-4" />
                        </motion.button>
                    </div>
                </form>

                <div className="mt-6 text-center text-sm text-gray-400">
                    Already have an account?{' '}
                    <Link to="/signin" className="text-red-400 hover:text-red-300 transition-colors">
                        Sign in
                    </Link>
                </div>

                <div className="mt-6 text-center">
                    <Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">
                        ← Back to home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
