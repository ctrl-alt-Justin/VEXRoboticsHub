import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Activity, Users } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
    const { events, activities, teamMembers } = useData();
    const { user } = useAuth();

    const userName = user ? user.name.split(' ')[0] : 'Guest';

    return (
        <div className="p-6 relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4"
            >
                <h1 className="text-2xl font-bold mb-1">Welcome back, {userName}! 👋</h1>
                <p className="text-sm text-gray-400">Here's what's happening with your team today.</p>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                >
                    <div className="flex items-center justify-between">
                        <Calendar className="w-6 h-6 text-blue-400" />
                        <span className="text-xl font-bold">{events.length}</span>
                    </div>
                    <h3 className="text-xs text-gray-400 mt-2">Upcoming Events</h3>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                >
                    <div className="flex items-center justify-between">
                        <Users className="w-6 h-6 text-green-400" />
                        <span className="text-xl font-bold">{teamMembers.filter(m => m.status === 'online').length}/{teamMembers.length}</span>
                    </div>
                    <h3 className="text-xs text-gray-400 mt-2">Members Online</h3>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                >
                    <div className="flex items-center justify-between">
                        <Activity className="w-6 h-6 text-orange-400" />
                        <span className="text-xl font-bold">{activities.length}</span>
                    </div>
                    <h3 className="text-xs text-gray-400 mt-2">Recent Activities</h3>
                </motion.div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                >
                    <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-red-400" />
                        Upcoming Events
                    </h2>
                    <div className="space-y-2">
                        {events.map((event) => (
                            <div
                                key={event.id}
                                className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-semibold truncate">{event.title}</h3>
                                        <p className="text-xs text-gray-400 mt-0.5">{event.location}</p>
                                    </div>
                                    <div className="text-right ml-2 flex-shrink-0">
                                        <p className="text-xs font-medium">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                                        <p className="text-xs text-gray-400">{event.time}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {events.length === 0 && (
                            <p className="text-gray-400 text-sm text-center py-4">No upcoming events.</p>
                        )}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                >
                    <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-orange-400" />
                        Recent Activity
                    </h2>
                    <div className="space-y-2">
                        {activities.map((activity) => (
                            <div
                                key={activity.id}
                                className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center font-bold text-xs flex-shrink-0">
                                        {activity.avatar}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs">
                                            <span className="font-semibold">{activity.user}</span> {activity.action}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {activities.length === 0 && (
                            <p className="text-gray-400 text-sm text-center py-4">No recent activity.</p>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
