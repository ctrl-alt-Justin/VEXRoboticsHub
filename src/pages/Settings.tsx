import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Bell, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
    // Get current user from AuthContext
    const { user } = useAuth();

    // Profile state reflects logged-in user
    const [profile, setProfile] = useState({ username: '', email: '', role: '' });

    // Sync profile with user data
    useEffect(() => {
        if (user) {
            setProfile({ username: user.name, email: user.email, role: user.role });
        }
    }, [user]);

    // Notification settings (kept as before)
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        events: true,
        inventory: false,
    });

    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

    const handleSaveProfile = () => {
        setSaveStatus('saving');
        // Simulate save operation
        setTimeout(() => {
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        }, 1000);
    };

    const cardBg = 'bg-white/5';
    const cardBorder = 'border-white/10';

    return (
        <div className="p-6 relative z-10">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold mb-1">Settings</h1>
                    <p className="text-sm text-gray-400">Manage your account and preferences</p>
                </div>

                <div className="space-y-6">
                    {/* Profile Settings */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`${cardBg} ${cardBorder} backdrop-blur-sm rounded-xl p-6`}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                <User className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold">Profile Information</h2>
                                <p className="text-xs text-gray-400">Update your personal details</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                                <input
                                    type="text"
                                    value={profile.username}
                                    onChange={e => setProfile({ ...profile, username: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={profile.email}
                                    onChange={e => setProfile({ ...profile, email: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                                <select
                                    value={profile.role}
                                    onChange={e => setProfile({ ...profile, role: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                                >
                                    <option value="Driver" className="bg-black">Driver</option>
                                    <option value="Programmer" className="bg-black">Programmer</option>
                                    <option value="Notebook" className="bg-black">Notebook</option>
                                    <option value="Builder" className="bg-black">Builder</option>
                                    <option value="Coach" className="bg-black">Coach</option>
                                    <option value="Adviser" className="bg-black">Adviser</option>
                                </select>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSaveProfile}
                                disabled={saveStatus === 'saving'}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${saveStatus === 'saved'
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                    : 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600'}`}
                            >
                                <Save className="w-4 h-4" />
                                {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Changes'}
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Notification Settings */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className={`${cardBg} ${cardBorder} backdrop-blur-sm rounded-xl p-6`}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-green-500/20 rounded-lg">
                                <Bell className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold">Notifications</h2>
                                <p className="text-xs text-gray-400">Manage how you receive updates</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {/* Email */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">Email Notifications</p>
                                    <p className="text-xs text-gray-400">Receive updates via email</p>
                                </div>
                                <button
                                    onClick={() => setNotifications({ ...notifications, email: !notifications.email })}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${notifications.email ? 'bg-red-500' : 'bg-white/10'}`}
                                >
                                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications.email ? 'translate-x-6' : 'translate-x-0'}`} />
                                </button>
                            </div>
                            {/* Push */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">Push Notifications</p>
                                    <p className="text-xs text-gray-400">Receive browser notifications</p>
                                </div>
                                <button
                                    onClick={() => setNotifications({ ...notifications, push: !notifications.push })}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${notifications.push ? 'bg-red-500' : 'bg-white/10'}`}
                                >
                                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications.push ? 'translate-x-6' : 'translate-x-0'}`} />
                                </button>
                            </div>
                            {/* Events */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">Event Reminders</p>
                                    <p className="text-xs text-gray-400">Get notified about upcoming events</p>
                                </div>
                                <button
                                    onClick={() => setNotifications({ ...notifications, events: !notifications.events })}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${notifications.events ? 'bg-red-500' : 'bg-white/10'}`}
                                >
                                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications.events ? 'translate-x-6' : 'translate-x-0'}`} />
                                </button>
                            </div>
                            {/* Inventory */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">Inventory Alerts</p>
                                    <p className="text-xs text-gray-400">Low stock and broken item alerts</p>
                                </div>
                                <button
                                    onClick={() => setNotifications({ ...notifications, inventory: !notifications.inventory })}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${notifications.inventory ? 'bg-red-500' : 'bg-white/10'}`}
                                >
                                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications.inventory ? 'translate-x-6' : 'translate-x-0'}`} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
