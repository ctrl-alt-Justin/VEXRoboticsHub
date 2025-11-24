import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Bell, Moon, Sun, Monitor, Save, Shield, Globe } from 'lucide-react';

export default function Settings() {
    // Profile settings
    const [profile, setProfile] = useState({
        username: 'John Doe',
        email: 'john.doe@example.com',
        role: 'Programmer',
    });

    // Appearance settings
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');

    // Notification settings
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        events: true,
        inventory: false,
    });

    // Accessibility settings
    const [accessibility, setAccessibility] = useState({
        reducedMotion: false,
        highContrast: false,
        fontSize: 'medium' as 'small' | 'medium' | 'large' | 'extra-large',
    });

    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

    const handleSaveProfile = () => {
        setSaveStatus('saving');
        setTimeout(() => {
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        }, 1000);
    };

    const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
        setTheme(newTheme);
        if (newTheme === 'light') {
            document.documentElement.classList.add('light-mode');
        } else {
            document.documentElement.classList.remove('light-mode');
        }
    };

    const cardBg = theme === 'light' ? 'bg-white/5' : 'bg-black/5';
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
                                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                                    placeholder="Enter your username"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={profile.email}
                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                                <select
                                    value={profile.role}
                                    onChange={(e) => setProfile({ ...profile, role: e.target.value })}
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

                    {/* Appearance Settings */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className={`${cardBg} ${cardBorder} backdrop-blur-sm rounded-xl p-6`}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-500/20 rounded-lg">
                                <Moon className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold">Appearance</h2>
                                <p className="text-xs text-gray-400">Customize how the app looks</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-300 mb-3">Theme</label>
                            <div className="grid grid-cols-3 gap-3">
                                <button
                                    onClick={() => handleThemeChange('light')}
                                    className={`p-4 rounded-lg border-2 transition-all ${theme === 'light'
                                        ? 'border-red-500 bg-red-500/10'
                                        : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                                >
                                    <Sun className={`w-6 h-6 mx-auto mb-2 ${theme === 'light' ? 'text-red-400' : 'text-gray-400'}`} />
                                    <p className="text-sm font-medium">Light</p>
                                </button>
                                <button
                                    onClick={() => handleThemeChange('dark')}
                                    className={`p-4 rounded-lg border-2 transition-all ${theme === 'dark'
                                        ? 'border-red-500 bg-red-500/10'
                                        : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                                >
                                    <Moon className={`w-6 h-6 mx-auto mb-2 ${theme === 'dark' ? 'text-red-400' : 'text-gray-400'}`} />
                                    <p className="text-sm font-medium">Dark</p>
                                </button>
                                <button
                                    onClick={() => handleThemeChange('system')}
                                    className={`p-4 rounded-lg border-2 transition-all ${theme === 'system'
                                        ? 'border-red-500 bg-red-500/10'
                                        : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                                >
                                    <Monitor className={`w-6 h-6 mx-auto mb-2 ${theme === 'system' ? 'text-red-400' : 'text-gray-0'}`} />
                                    <p className="text-sm font-medium">System</p>
                                </button>
                            </div>
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
                                    <div
                                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications.email ? 'translate-x-6' : 'translate-x-0'}`}
                                    />
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
                                    <div
                                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications.push ? 'translate-x-6' : 'translate-x-0'}`}
                                    />
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
                                    <div
                                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications.events ? 'translate-x-6' : 'translate-x-0'}`}
                                    />
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
                                    <div
                                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications.inventory ? 'translate-x-6' : 'translate-x-0'}`}
                                    />
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Accessibility Settings */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className={`${cardBg} ${cardBorder} backdrop-blur-sm rounded-xl p-6`}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-orange-500/20 rounded-lg">
                                <Globe className="w-5 h-5 text-orange-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold">Accessibility</h2>
                                <p className="text-xs text-gray-400">Adjust app accessibility features</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {/* Reduced Motion */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">Reduced Motion</p>
                                    <p className="text-xs text-gray-400">Minimize animations and transitions</p>
                                </div>
                                <button
                                    onClick={() => setAccessibility({ ...accessibility, reducedMotion: !accessibility.reducedMotion })}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${accessibility.reducedMotion ? 'bg-red-500' : 'bg-white/10'}`}
                                >
                                    <div
                                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${accessibility.reducedMotion ? 'translate-x-6' : 'translate-x-0'}`}
                                    />
                                </button>
                            </div>
                            {/* High Contrast */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">High Contrast</p>
                                    <p className="text-xs text-gray-400">Increase color contrast for better visibility</p>
                                </div>
                                <button
                                    onClick={() => setAccessibility({ ...accessibility, highContrast: !accessibility.highContrast })}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${accessibility.highContrast ? 'bg-red-500' : 'bg-white/10'}`}
                                >
                                    <div
                                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${accessibility.highContrast ? 'translate-x-6' : 'translate-x-0'}`}
                                    />
                                </button>
                            </div>
                            {/* Text Size */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Text Size</label>
                                <select
                                    value={accessibility.fontSize}
                                    onChange={(e) => setAccessibility({ ...accessibility, fontSize: e.target.value as any })}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                                >
                                    <option value="small" className="bg-black">Small</option>
                                    <option value="medium" className="bg-black">Medium</option>
                                    <option value="large" className="bg-black">Large</option>
                                    <option value="extra-large" className="bg-black">Extra Large</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>

                    {/* Security Settings */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className={`${cardBg} ${cardBorder} backdrop-blur-sm rounded-xl p-6`}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-red-500/20 rounded-lg">
                                <Shield className="w-5 h-5 text-red-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold">Security</h2>
                                <p className="text-xs text-gray-400">Manage your account security</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <button className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-left">
                                <p className="text-sm font-medium">Change Password</p>
                                <p className="text-xs text-gray-400">Update your account password</p>
                            </button>
                            <button className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-left">
                                <p className="text-sm font-medium">Two-Factor Authentication</p>
                                <p className="text-xs text-gray-400">Add an extra layer of security</p>
                            </button>
                            <button className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-left">
                                <p className="text-sm font-medium">Active Sessions</p>
                                <p className="text-xs text-gray-400">Manage devices signed into your account</p>
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
