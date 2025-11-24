import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Plus, Clock, MapPin, Users, X, Edit2, Bell } from 'lucide-react';
import { useData, Event } from '../context/DataContext';

export default function Events() {
    const { events, teamMembers, addEvent, updateEvent, deleteEvent } = useData();
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [hoveredButton, setHoveredButton] = useState<string | null>(null);

    // Mock current user - in real app would come from auth
    const currentUser = { id: 2, name: 'Mike Johnson' };
    const currentUserRole = 'Coach';
    const canManageEvents = ['Coach', 'Adviser'].includes(currentUserRole);

    const [newEvent, setNewEvent] = useState<Omit<Event, 'id'>>({
        title: '',
        date: '',
        time: '',
        location: '',
        description: '',
        gatherAvailability: false,
        attendees: []
    });

    // Calendar logic
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }
        return days;
    };

    const getEventsForDay = (day: number) => {
        const year = currentMonth.getFullYear();
        const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        const dateStr = `${year}-${month}-${dayStr}`;
        return events.filter(event => event.date === dateStr);
    };

    const getEventsForSelectedDate = () => {
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        return events.filter(event => event.date === dateStr);
    };

    const handleAddEvent = () => {
        if (!canManageEvents) return;

        const eventToAdd = {
            ...newEvent,
            attendees: newEvent.gatherAvailability
                ? teamMembers.map(m => ({ id: m.id, name: m.name, status: 'pending' }))
                : []
        };

        addEvent(eventToAdd);
        setShowAddModal(false);
        setNewEvent({
            title: '',
            date: '',
            time: '',
            location: '',
            description: '',
            gatherAvailability: false,
            attendees: []
        });
    };

    const handleUpdateEvent = () => {
        if (!canManageEvents || !editingEvent) return;

        updateEvent(editingEvent);
        setEditingEvent(null);
    };

    const handleDeleteEvent = (eventId: number) => {
        if (!canManageEvents) return;
        if (confirm('Are you sure you want to delete this event?')) {
            deleteEvent(eventId);
            setEditingEvent(null);
        }
    };

    const handleVote = (eventId: number, status: string) => {
        const event = events.find(e => e.id === eventId);
        if (!event) return;

        const attendeeExists = event.attendees.some(a => a.id === currentUser.id);
        let updatedAttendees;

        if (attendeeExists) {
            updatedAttendees = event.attendees.map(a =>
                a.id === currentUser.id ? { ...a, status } : a
            );
        } else {
            updatedAttendees = [...event.attendees, { id: currentUser.id, name: currentUser.name, status }];
        }

        updateEvent({ ...event, attendees: updatedAttendees });
    };

    const getUserVote = (event: Event) => {
        return event.attendees.find(a => a.id === currentUser.id)?.status || null;
    };

    const getAttendeesByStatus = (event: Event, status: string) => {
        return event.attendees.filter(a => a.status === status);
    };

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    const isToday = (day: number) => {
        const today = new Date();
        return day === today.getDate() &&
            currentMonth.getMonth() === today.getMonth() &&
            currentMonth.getFullYear() === today.getFullYear();
    };

    const isSelectedDate = (day: number) => {
        return day === selectedDate.getDate() &&
            currentMonth.getMonth() === selectedDate.getMonth() &&
            currentMonth.getFullYear() === selectedDate.getFullYear();
    };

    const upcomingEvents = events
        .filter(e => new Date(e.date) >= new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5);

    return (
        <div className="p-6 relative z-10">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Events Schedule</h1>
                    {canManageEvents && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg font-medium hover:from-red-600 hover:to-orange-600 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add Event
                        </motion.button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Calendar */}
                    <div className="lg:col-span-2">
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                            {/* Month/Year Selectors */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex gap-3">
                                    <select
                                        value={currentMonth.getMonth()}
                                        onChange={(e) => setCurrentMonth(new Date(currentMonth.getFullYear(), parseInt(e.target.value)))}
                                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                                    >
                                        {monthNames.map((month, idx) => (
                                            <option key={idx} value={idx} className="bg-black">{month}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={currentMonth.getFullYear()}
                                        onChange={(e) => setCurrentMonth(new Date(parseInt(e.target.value), currentMonth.getMonth()))}
                                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                                    >
                                        {[2024, 2025, 2026].map(year => (
                                            <option key={year} value={year} className="bg-black">{year}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                        ←
                                    </button>
                                    <button
                                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                        →
                                    </button>
                                </div>
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-1">
                                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                                    <div key={day} className="text-center text-xs font-semibold text-gray-400 pb-3 uppercase">
                                        {day}
                                    </div>
                                ))}

                                {getDaysInMonth(currentMonth).map((day, index) => {
                                    const dayEvents = day ? getEventsForDay(day) : [];
                                    return (
                                        <div
                                            key={index}
                                            onClick={() => day && setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
                                            className={`min-h-24 p-2 rounded-lg border cursor-pointer transition-all ${day
                                                ? isToday(day)
                                                    ? 'bg-gradient-to-br from-red-500/30 to-orange-500/30 border-red-500/50 ring-2 ring-red-500/50'
                                                    : isSelectedDate(day)
                                                        ? 'bg-white/10 border-white/30'
                                                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                                                : 'bg-transparent border-transparent'
                                                }`}
                                        >
                                            {day && (
                                                <>
                                                    <div className={`text-sm font-semibold mb-1 ${isToday(day) ? 'text-red-400' : ''}`}>
                                                        {day}
                                                    </div>
                                                    <div className="space-y-1">
                                                        {dayEvents.slice(0, 2).map(event => (
                                                            <div
                                                                key={event.id}
                                                                className="text-xs p-1.5 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded border border-red-500/30 truncate"
                                                            >
                                                                <div className="font-medium truncate">{event.time} {event.title}</div>
                                                            </div>
                                                        ))}
                                                        {dayEvents.length > 2 && (
                                                            <div className="text-xs text-gray-400 pl-1">+{dayEvents.length - 2} more</div>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar - Selected Date */}
                    <div className="lg:col-span-1 space-y-4">
                        {/* Selected Date Events */}
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <CalendarIcon className="w-5 h-5 text-red-400" />
                                <h3 className="font-semibold">
                                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                                </h3>
                            </div>

                            {getEventsForSelectedDate().length > 0 ? (
                                <div className="space-y-3">
                                    {getEventsForSelectedDate().map(event => {
                                        const userVote = getUserVote(event);
                                        return (
                                            <div key={event.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h4 className="font-semibold flex-1">{event.title}</h4>
                                                    {canManageEvents && (
                                                        <button
                                                            onClick={() => setEditingEvent(event)}
                                                            className="p-1 hover:bg-white/10 rounded transition-colors"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                                                    <Clock className="w-3 h-3" />
                                                    {event.time}
                                                    <MapPin className="w-3 h-3 ml-2" />
                                                    {event.location}
                                                </div>

                                                {event.gatherAvailability && (
                                                    <>
                                                        <div className="text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wide">Availability Check</div>
                                                        <div className="flex gap-2 mb-3">
                                                            <button
                                                                onClick={() => event.id && handleVote(event.id, 'available')}
                                                                onMouseEnter={() => setHoveredButton(`${event.id}-available`)}
                                                                onMouseLeave={() => setHoveredButton(null)}
                                                                className={`relative flex-1 px-2 py-1.5 rounded text-xs font-medium transition-colors ${userVote === 'available'
                                                                    ? 'bg-green-500/40 text-green-300 ring-2 ring-green-500/50'
                                                                    : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                                                    }`}
                                                            >
                                                                ✓ Going
                                                                {hoveredButton === `${event.id}-available` && getAttendeesByStatus(event, 'available').length > 0 && (
                                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black border border-white/20 rounded-lg shadow-xl whitespace-nowrap z-50">
                                                                        <div className="text-xs font-semibold mb-1">Going ({getAttendeesByStatus(event, 'available').length})</div>
                                                                        {getAttendeesByStatus(event, 'available').map(a => (
                                                                            <div key={a.id} className="text-xs text-gray-300">{a.name}</div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </button>
                                                            <button
                                                                onClick={() => event.id && handleVote(event.id, 'pending')}
                                                                onMouseEnter={() => setHoveredButton(`${event.id}-pending`)}
                                                                onMouseLeave={() => setHoveredButton(null)}
                                                                className={`relative flex-1 px-2 py-1.5 rounded text-xs font-medium transition-colors ${userVote === 'pending'
                                                                    ? 'bg-gray-500/40 text-gray-300 ring-2 ring-gray-500/50'
                                                                    : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                                                                    }`}
                                                            >
                                                                ~ Maybe
                                                                {hoveredButton === `${event.id}-pending` && getAttendeesByStatus(event, 'pending').length > 0 && (
                                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black border border-white/20 rounded-lg shadow-xl whitespace-nowrap z-50">
                                                                        <div className="text-xs font-semibold mb-1">Maybe ({getAttendeesByStatus(event, 'pending').length})</div>
                                                                        {getAttendeesByStatus(event, 'pending').map(a => (
                                                                            <div key={a.id} className="text-xs text-gray-300">{a.name}</div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </button>
                                                            <button
                                                                onClick={() => event.id && handleVote(event.id, 'not-available')}
                                                                onMouseEnter={() => setHoveredButton(`${event.id}-not-available`)}
                                                                onMouseLeave={() => setHoveredButton(null)}
                                                                className={`relative flex-1 px-2 py-1.5 rounded text-xs font-medium transition-colors ${userVote === 'not-available'
                                                                    ? 'bg-red-500/40 text-red-300 ring-2 ring-red-500/50'
                                                                    : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                                                    }`}
                                                            >
                                                                ✗ Out
                                                                {hoveredButton === `${event.id}-not-available` && getAttendeesByStatus(event, 'not-available').length > 0 && (
                                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black border border-white/20 rounded-lg shadow-xl whitespace-nowrap z-50">
                                                                        <div className="text-xs font-semibold mb-1">Out ({getAttendeesByStatus(event, 'not-available').length})</div>
                                                                        {getAttendeesByStatus(event, 'not-available').map(a => (
                                                                            <div key={a.id} className="text-xs text-gray-300">{a.name}</div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </button>
                                                        </div>
                                                        <div className="flex justify-between text-xs">
                                                            <span className="text-green-400">
                                                                {getAttendeesByStatus(event, 'available').length} Going
                                                            </span>
                                                            <span className="text-gray-400">
                                                                {getAttendeesByStatus(event, 'pending').length} Maybe
                                                            </span>
                                                            <span className="text-red-400">
                                                                {getAttendeesByStatus(event, 'not-available').length} Out
                                                            </span>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 text-center py-8">No events scheduled</p>
                            )}
                        </div>

                        {/* Upcoming Events */}
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <Bell className="w-5 h-5 text-orange-400" />
                                <h3 className="font-semibold">Upcoming</h3>
                            </div>
                            <div className="space-y-2">
                                {upcomingEvents.map(event => (
                                    <div
                                        key={event.id}
                                        onClick={() => {
                                            const eventDate = new Date(event.date);
                                            setSelectedDate(eventDate);
                                            setCurrentMonth(eventDate);
                                        }}
                                        className="p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                                    >
                                        <div className="flex gap-3">
                                            <div className="text-center flex-shrink-0">
                                                <div className="text-xl font-bold">{new Date(event.date).getDate()}</div>
                                                <div className="text-xs text-gray-400 uppercase">
                                                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-sm truncate">{event.title}</h4>
                                                <p className="text-xs text-gray-400">{event.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add/Edit Event Modal */}
            <AnimatePresence>
                {(showAddModal || editingEvent) && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-black/90 border border-white/10 rounded-xl p-6 max-w-md w-full"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold">{editingEvent ? 'Edit Event' : 'Add New Event'}</h2>
                                <button
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setEditingEvent(null);
                                    }}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Event Title</label>
                                    <input
                                        type="text"
                                        value={editingEvent ? editingEvent.title : newEvent.title}
                                        onChange={(e) => editingEvent
                                            ? setEditingEvent({ ...editingEvent, title: e.target.value })
                                            : setNewEvent({ ...newEvent, title: e.target.value })
                                        }
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                                        placeholder="Enter event title"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                                        <input
                                            type="date"
                                            value={editingEvent ? editingEvent.date : newEvent.date}
                                            onChange={(e) => editingEvent
                                                ? setEditingEvent({ ...editingEvent, date: e.target.value })
                                                : setNewEvent({ ...newEvent, date: e.target.value })
                                            }
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Time</label>
                                        <input
                                            type="time"
                                            value={editingEvent ? editingEvent.time : newEvent.time}
                                            onChange={(e) => editingEvent
                                                ? setEditingEvent({ ...editingEvent, time: e.target.value })
                                                : setNewEvent({ ...newEvent, time: e.target.value })
                                            }
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                                    <input
                                        type="text"
                                        value={editingEvent ? editingEvent.location : newEvent.location}
                                        onChange={(e) => editingEvent
                                            ? setEditingEvent({ ...editingEvent, location: e.target.value })
                                            : setNewEvent({ ...newEvent, location: e.target.value })
                                        }
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                                        placeholder="Enter location"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                    <textarea
                                        value={editingEvent ? editingEvent.description : newEvent.description}
                                        onChange={(e) => editingEvent
                                            ? setEditingEvent({ ...editingEvent, description: e.target.value })
                                            : setNewEvent({ ...newEvent, description: e.target.value })
                                        }
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors resize-none"
                                        rows={3}
                                        placeholder="Enter event description"
                                    />
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                                    <input
                                        type="checkbox"
                                        id="gather-availability"
                                        checked={editingEvent ? editingEvent.gatherAvailability : newEvent.gatherAvailability}
                                        onChange={(e) => editingEvent
                                            ? setEditingEvent({ ...editingEvent, gatherAvailability: e.target.checked })
                                            : setNewEvent({ ...newEvent, gatherAvailability: e.target.checked })
                                        }
                                        className="w-4 h-4 rounded border-white/20 bg-white/5 text-red-500 focus:ring-red-500"
                                    />
                                    <label htmlFor="gather-availability" className="text-sm flex-1">
                                        <span className="font-medium">Gather Member Availability</span>
                                        <p className="text-xs text-gray-400 mt-1">Members can mark if they're available or not</p>
                                    </label>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    {editingEvent && (
                                        <button
                                            onClick={() => editingEvent.id && handleDeleteEvent(editingEvent.id)}
                                            className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            setShowAddModal(false);
                                            setEditingEvent(null);
                                        }}
                                        className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={editingEvent ? handleUpdateEvent : handleAddEvent}
                                        className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg font-medium hover:from-red-600 hover:to-orange-600 transition-colors"
                                    >
                                        {editingEvent ? 'Update' : 'Add'} Event
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
