import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor, Bell, BellOff, Eye, EyeOff, Type, Sparkles } from 'lucide-react';

export default function ThemeTest() {
    // Theme state
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');

    // Notification states
    const [emailNotif, setEmailNotif] = useState(true);
    const [pushNotif, setPushNotif] = useState(true);
    const [eventNotif, setEventNotif] = useState(true);
    const [inventoryNotif, setInventoryNotif] = useState(false);

    // Accessibility states
    const [reducedMotion, setReducedMotion] = useState(false);
    const [highContrast, setHighContrast] = useState(false);
    const [fontSize, setFontSize] = useState('medium');

    // Apply theme to HTML element
    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'light') {
            root.classList.add('light-mode');
        } else if (theme === 'dark') {
            root.classList.remove('light-mode');
        } else {
            // System preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                root.classList.remove('light-mode');
            } else {
                root.classList.add('light-mode');
            }
        }
    }, [theme]);

    // Apply reduced motion
    useEffect(() => {
        if (reducedMotion) {
            document.documentElement.style.setProperty('--animation-duration', '0s');
        } else {
            document.documentElement.style.setProperty('--animation-duration', '0.3s');
        }
    }, [reducedMotion]);

    // Apply font size
    useEffect(() => {
        const sizeMap: Record<string, string> = {
            small: '14px',
            medium: '16px',
            large: '18px',
            'extra-large': '20px',
        };
        document.documentElement.style.fontSize = sizeMap[fontSize] || '16px';
    }, [fontSize]);

    const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
        <button
            onClick={onChange}
            className={`relative w-12 h-6 rounded-full transition-colors ${checked ? 'bg-red-500' : 'bg-gray-600 dark:bg-white/10'
                }`}
        >
            <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${checked ? 'translate-x-6' : 'translate-x-0'
                    }`}
            />
        </button>
    );

    return (
        <div className="p-6 relative z-10">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-2">🎨 Theme & Settings Test Page</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Test all theme modes and accessibility features in real-time
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column - Theme Controls */}
                    <div className="space-y-6">
                        {/* Theme Selector */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-100 dark:bg-white/5 backdrop-blur-sm border border-gray-300 dark:border-white/10 rounded-xl p-6"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-purple-500/20 rounded-lg">
                                    <Sparkles className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Theme Mode</h2>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Switch between light and dark</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <button
                                    onClick={() => setTheme('light')}
                                    className={`p-4 rounded-lg border-2 transition-all ${theme === 'light'
                                            ? 'border-red-500 bg-red-500/10'
                                            : 'border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10'
                                        }`}
                                >
                                    <Sun className={`w-6 h-6 mx-auto mb-2 ${theme === 'light' ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}`} />
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Light</p>
                                </button>

                                <button
                                    onClick={() => setTheme('dark')}
                                    className={`p-4 rounded-lg border-2 transition-all ${theme === 'dark'
                                            ? 'border-red-500 bg-red-500/10'
                                            : 'border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10'
                                        }`}
                                >
                                    <Moon className={`w-6 h-6 mx-auto mb-2 ${theme === 'dark' ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}`} />
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Dark</p>
                                </button>

                                <button
                                    onClick={() => setTheme('system')}
                                    className={`p-4 rounded-lg border-2 transition-all ${theme === 'system'
                                            ? 'border-red-500 bg-red-500/10'
                                            : 'border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10'
                                        }`}
                                >
                                    <Monitor className={`w-6 h-6 mx-auto mb-2 ${theme === 'system' ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}`} />
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">System</p>
                                </button>
                            </div>

                            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                <p className="text-sm text-blue-600 dark:text-blue-400">
                                    <strong>Current Mode:</strong> {theme.charAt(0).toUpperCase() + theme.slice(1)}
                                </p>
                            </div>
                        </motion.div>

                        {/* Notifications */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-gray-100 dark:bg-white/5 backdrop-blur-sm border border-gray-300 dark:border-white/10 rounded-xl p-6"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-green-500/20 rounded-lg">
                                    <Bell className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Notifications</h2>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Toggle notification preferences</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Email Notifications</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Status: {emailNotif ? 'Enabled ✓' : 'Disabled ✗'}</p>
                                    </div>
                                    <ToggleSwitch checked={emailNotif} onChange={() => setEmailNotif(!emailNotif)} />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Push Notifications</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Status: {pushNotif ? 'Enabled ✓' : 'Disabled ✗'}</p>
                                    </div>
                                    <ToggleSwitch checked={pushNotif} onChange={() => setPushNotif(!pushNotif)} />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Event Reminders</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Status: {eventNotif ? 'Enabled ✓' : 'Disabled ✗'}</p>
                                    </div>
                                    <ToggleSwitch checked={eventNotif} onChange={() => setEventNotif(!eventNotif)} />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Inventory Alerts</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Status: {inventoryNotif ? 'Enabled ✓' : 'Disabled ✗'}</p>
                                    </div>
                                    <ToggleSwitch checked={inventoryNotif} onChange={() => setInventoryNotif(!inventoryNotif)} />
                                </div>
                            </div>
                        </motion.div>

                        {/* Accessibility */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-gray-100 dark:bg-white/5 backdrop-blur-sm border border-gray-300 dark:border-white/10 rounded-xl p-6"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-orange-500/20 rounded-lg">
                                    <Eye className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Accessibility</h2>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Customize accessibility features</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Reduced Motion</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Status: {reducedMotion ? 'Active ✓' : 'Inactive ✗'}</p>
                                    </div>
                                    <ToggleSwitch checked={reducedMotion} onChange={() => setReducedMotion(!reducedMotion)} />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">High Contrast</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Status: {highContrast ? 'Active ✓' : 'Inactive ✗'}</p>
                                    </div>
                                    <ToggleSwitch checked={highContrast} onChange={() => setHighContrast(!highContrast)} />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                        Text Size: {fontSize}
                                    </label>
                                    <select
                                        value={fontSize}
                                        onChange={(e) => setFontSize(e.target.value)}
                                        className="w-full px-4 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors text-gray-900 dark:text-white"
                                    >
                                        <option value="small" className="bg-white dark:bg-black">Small (14px)</option>
                                        <option value="medium" className="bg-white dark:bg-black">Medium (16px)</option>
                                        <option value="large" className="bg-white dark:bg-black">Large (18px)</option>
                                        <option value="extra-large" className="bg-white dark:bg-black">Extra Large (20px)</option>
                                    </select>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - Preview */}
                    <div className="space-y-6">
                        {/* Preview Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-gray-100 dark:bg-white/5 backdrop-blur-sm border border-gray-300 dark:border-white/10 rounded-xl p-6"
                        >
                            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Live Preview</h2>

                            <div className="space-y-4">
                                {/* Sample Content */}
                                <div className="p-4 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg">
                                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Sample Card</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                        This card demonstrates how content appears in the current theme. The background, text, and borders adapt automatically.
                                    </p>
                                    <div className="flex gap-2">
                                        <span className="px-3 py-1 bg-green-500/20 text-green-700 dark:text-green-400 rounded-full text-xs">
                                            Available
                                        </span>
                                        <span className="px-3 py-1 bg-blue-500/20 text-blue-700 dark:text-blue-400 rounded-full text-xs">
                                            In Use
                                        </span>
                                        <span className="px-3 py-1 bg-red-500/20 text-red-700 dark:text-red-400 rounded-full text-xs">
                                            Broken
                                        </span>
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg">
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Total Items</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
                                    </div>
                                    <div className="p-3 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg">
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Available</p>
                                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">5</p>
                                    </div>
                                </div>

                                {/* Button Samples */}
                                <div className="space-y-2">
                                    <button className="w-full px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg font-medium hover:from-red-600 hover:to-orange-600 transition-colors">
                                        Primary Button
                                    </button>
                                    <button className="w-full px-4 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                                        Secondary Button
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Status Summary */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-gray-100 dark:bg-white/5 backdrop-blur-sm border border-gray-300 dark:border-white/10 rounded-xl p-6"
                        >
                            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Settings Summary</h2>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Theme:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{theme}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Email Notifications:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{emailNotif ? 'On' : 'Off'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Push Notifications:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{pushNotif ? 'On' : 'Off'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Event Reminders:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{eventNotif ? 'On' : 'Off'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Inventory Alerts:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{inventoryNotif ? 'On' : 'Off'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Reduced Motion:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{reducedMotion ? 'On' : 'Off'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">High Contrast:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{highContrast ? 'On' : 'Off'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Font Size:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{fontSize}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Instructions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl"
                >
                    <h3 className="font-bold mb-2 text-gray-900 dark:text-white">🧪 Testing Instructions</h3>
                    <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                        <li>• Click theme buttons to instantly switch between Light, Dark, and System modes</li>
                        <li>• Toggle all notification switches to test state management</li>
                        <li>• Enable Reduced Motion to see animation changes</li>
                        <li>• Change Text Size to see real-time font scaling</li>
                        <li>• All changes are reflected immediately in the preview area</li>
                    </ul>
                </motion.div>
            </div>
        </div>
    );
}
