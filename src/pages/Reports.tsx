import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, AlertTriangle, Package, TrendingUp, FileText } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function Reports() {
    const { inventory, activities } = useData();
    const [selectedPeriod, setSelectedPeriod] = useState('month');

    // Calculate inventory stats
    const total = inventory.length;
    const available = inventory.filter(i => i.status === 'available').length;
    const used = inventory.filter(i => i.status === 'used').length;
    const broken = inventory.filter(i => i.status === 'broken').length;

    const byType = inventory.reduce((acc, item) => {
        acc[item.type] = (acc[item.type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const brokenItems = inventory.filter(i => i.status === 'broken');

    const handleExportCSV = () => {
        // Create CSV content
        const headers = ['Item Name', 'Control ID', 'Category', 'Status', 'Last Checked'];
        const rows = brokenItems.map(item => [
            item.name,
            item.controlId || 'N/A',
            item.type,
            item.status,
            new Date().toLocaleDateString() // Mock last checked
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vex-robotics-report-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const availablePercent = total > 0 ? (available / total) * 100 : 0;
    const usedPercent = total > 0 ? (used / total) * 100 : 0;
    const brokenPercent = total > 0 ? (broken / total) * 100 : 0;

    return (
        <div className="p-6 relative z-10">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold mb-1">Analytics Reports</h1>
                        <p className="text-sm text-gray-400">Detailed breakdown of inventory status and health</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                        >
                            <option value="week" className="bg-black">This Week</option>
                            <option value="month" className="bg-black">This Month</option>
                            <option value="year" className="bg-black">This Year</option>
                            <option value="all" className="bg-black">All Time</option>
                        </select>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleExportCSV}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Export CSV
                        </motion.button>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-500/20 rounded-lg">
                                <Package className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Total Items</p>
                                <p className="text-2xl font-bold">{total}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-green-500/20 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Available</p>
                                <p className="text-2xl font-bold text-green-400">{available}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-500/20 rounded-lg">
                                <FileText className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">In Use</p>
                                <p className="text-2xl font-bold text-blue-400">{used}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-red-500/20 rounded-lg">
                                <AlertTriangle className="w-6 h-6 text-red-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Broken</p>
                                <p className="text-2xl font-bold text-red-400">{broken}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Item Condition Status */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
                    >
                        <h3 className="text-lg font-bold mb-6">Item Condition Status</h3>

                        {/* Donut Chart Representation */}
                        <div className="flex flex-col items-center">
                            <div className="relative w-48 h-48 mb-6">
                                {/* Simple circular representation */}
                                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                                    {/* Available segment */}
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        fill="none"
                                        stroke="#10b981"
                                        strokeWidth="20"
                                        strokeDasharray={`${availablePercent * 2.51} ${251 - availablePercent * 2.51}`}
                                        className="opacity-80"
                                    />
                                    {/* Used segment */}
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        fill="none"
                                        stroke="#3b82f6"
                                        strokeWidth="20"
                                        strokeDasharray={`${usedPercent * 2.51} ${251 - usedPercent * 2.51}`}
                                        strokeDashoffset={-availablePercent * 2.51}
                                        className="opacity-80"
                                    />
                                    {/* Broken segment */}
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        fill="none"
                                        stroke="#ef4444"
                                        strokeWidth="20"
                                        strokeDasharray={`${brokenPercent * 2.51} ${251 - brokenPercent * 2.51}`}
                                        strokeDashoffset={-(availablePercent + usedPercent) * 2.51}
                                        className="opacity-80"
                                    />
                                </svg>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span className="text-sm">Available ({available})</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                    <span className="text-sm">Broken ({broken})</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    <span className="text-sm">Used ({used})</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Inventory by Category */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
                    >
                        <h3 className="text-lg font-bold mb-6">Inventory by Category</h3>

                        <div className="space-y-4">
                            {Object.entries(byType).map(([type, count], index) => (
                                <div key={type}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm capitalize">{type}</span>
                                        <span className="text-sm font-semibold">{count}</span>
                                    </div>
                                    <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(count / total) * 100}%` }}
                                            transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Damaged/Broken Items Report */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden mb-6"
                >
                    <div className="p-6 border-b border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-500/20 rounded-lg">
                                <AlertTriangle className="w-5 h-5 text-red-400" />
                            </div>
                            <h3 className="text-lg font-bold">Damaged / Broken Items Report</h3>
                        </div>
                        <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-medium">
                            {brokenItems.length} Items
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/5 border-b border-white/10">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Item Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Control ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Last Checked</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {brokenItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium">{item.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-400 font-mono">{item.controlId || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm capitalize">{item.type}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium w-fit">
                                                <AlertTriangle className="w-3 h-3" />
                                                Broken
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-400">{new Date().toLocaleDateString()}</div>
                                        </td>
                                    </tr>
                                ))}
                                {brokenItems.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center text-gray-400">
                                            No broken items reported.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
                >
                    <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                        {activities.slice(0, 5).map((activity, index) => (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 + index * 0.1 }}
                                className="flex items-start gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                            >
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                <div className="flex-1">
                                    <p className="text-sm">
                                        <span className="font-semibold">{activity.action}</span>: {activity.item || 'Activity'}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {activity.user} • {activity.time}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
