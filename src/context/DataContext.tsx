import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// --- Types ---

export interface InventoryItem {
    id: number;
    name: string;
    controlId: string;
    quantity: number;
    status: 'available' | 'used' | 'broken';
    type: 'metal' | 'consumable' | 'sensors' | 'motors' | 'electronics';
}

export interface TeamMember {
    id: number;
    name: string;
    role: string;
    status: 'online' | 'offline' | 'available' | 'not-available' | 'pending';
    avatar?: string;
}

export interface EventAttendee {
    id: number;
    name: string;
    status: string;
}

export interface Event {
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
    gatherAvailability: boolean;
    attendees: EventAttendee[];
}

export interface Activity {
    id: number;
    user: string;
    action: string;
    item?: string;
    time: string;
    avatar?: string;
}

interface DataContextType {
    inventory: InventoryItem[];
    events: Event[];
    activities: Activity[];
    teamMembers: TeamMember[];

    // Actions
    addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
    updateInventoryItem: (item: InventoryItem) => void;
    deleteInventoryItem: (id: number) => void;

    addEvent: (event: Omit<Event, 'id'>) => void;
    updateEvent: (event: Event) => void;
    deleteEvent: (id: number) => void;

    addActivity: (activity: Omit<Activity, 'id' | 'time'>) => void;
    refreshData: () => Promise<void>;
}

// --- Context ---

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

    const fetchData = async () => {
        try {
            const [invRes, evtRes, actRes, teamRes] = await Promise.all([
                fetch('/api/db?table=inventory'),
                fetch('/api/db?table=events'),
                fetch('/api/db?table=activities'),
                fetch('/api/db?table=team_members')
            ]);

            if (invRes.ok) setInventory(await invRes.json());
            if (evtRes.ok) setEvents(await evtRes.json());
            if (actRes.ok) setActivities(await actRes.json());
            if (teamRes.ok) setTeamMembers(await teamRes.json());
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    // Fetch initial data
    useEffect(() => {
        fetchData();
    }, []);

    const refreshData = async () => {
        await fetchData();
    };

    const addInventoryItem = async (item: Omit<InventoryItem, 'id'>) => {
        try {
            const res = await fetch('/api/db?table=inventory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
            });
            if (res.ok) {
                const newItem = await res.json();
                setInventory(prev => [...prev, newItem]);
                addActivity({
                    user: 'Current User',
                    action: 'added new item',
                    item: item.name
                });
            }
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    const updateInventoryItem = async (updatedItem: InventoryItem) => {
        try {
            const res = await fetch('/api/db?table=inventory', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedItem)
            });
            if (res.ok) {
                setInventory(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));

                // Check for broken status update
                const oldItem = inventory.find(i => i.id === updatedItem.id);
                if (oldItem && oldItem.status !== 'broken' && updatedItem.status === 'broken') {
                    addActivity({
                        user: 'Current User',
                        action: 'marked item as broken',
                        item: updatedItem.name
                    });
                }
            }
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    const deleteInventoryItem = async (id: number) => {
        try {
            const res = await fetch(`/api/db?table=inventory&id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setInventory(prev => prev.filter(item => item.id !== id));
            }
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const addEvent = async (event: Omit<Event, 'id'>) => {
        try {
            const res = await fetch('/api/db?table=events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(event)
            });
            if (res.ok) {
                const newEvent = await res.json();
                setEvents(prev => [...prev, newEvent]);
                addActivity({
                    user: 'Current User',
                    action: 'created event',
                    item: event.title
                });
            }
        } catch (error) {
            console.error('Error adding event:', error);
        }
    };

    const updateEvent = (updatedEvent: Event) => {
        // TODO: Implement API update for events
        setEvents(events.map(event => event.id === updatedEvent.id ? updatedEvent : event));
    };

    const deleteEvent = (id: number) => {
        // TODO: Implement API delete for events
        setEvents(events.filter(event => event.id !== id));
    };

    const addActivity = async (activity: Omit<Activity, 'id' | 'time'>) => {
        try {
            const payload = {
                user_name: activity.user,
                action: activity.action,
                item: activity.item,
                avatar: activity.avatar || 'CU'
            };
            const res = await fetch('/api/db?table=activities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                const newActivity = await res.json();
                setActivities(prev => [newActivity, ...prev]);
            }
        } catch (error) {
            console.error('Error adding activity:', error);
        }
    };

    return (
        <DataContext.Provider value={{
            inventory,
            events,
            activities,
            teamMembers,
            addInventoryItem,
            updateInventoryItem,
            deleteInventoryItem,
            addEvent,
            updateEvent,
            deleteEvent,
            addActivity,
            refreshData
        }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}
