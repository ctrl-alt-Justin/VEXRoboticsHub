import React, { createContext, useContext, useState, ReactNode } from 'react';

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
}

// --- Mock Data ---

const INITIAL_INVENTORY: InventoryItem[] = [
    { id: 1, name: 'Aluminum C-Channel', controlId: 'MTL-001', quantity: 25, status: 'available', type: 'metal' },
    { id: 2, name: 'VEX V5 Brain', controlId: 'ELC-001', quantity: 2, status: 'used', type: 'electronics' },
    { id: 3, name: 'Line Tracking Sensor', controlId: 'SNS-004', quantity: 4, status: 'available', type: 'sensors' },
    { id: 4, name: '393 Motor', controlId: 'MTR-012', quantity: 8, status: 'available', type: 'motors' },
    { id: 5, name: 'Shaft Collars', controlId: 'MTL-045', quantity: 50, status: 'available', type: 'metal' },
    { id: 6, name: 'Cortex Controller', controlId: 'ELC-002', quantity: 1, status: 'broken', type: 'electronics' },
    { id: 7, name: 'Zip Ties', controlId: 'CNS-099', quantity: 100, status: 'available', type: 'consumable' },
    { id: 8, name: 'Vision Sensor', controlId: 'SNS-008', quantity: 2, status: 'used', type: 'sensors' },
];

const INITIAL_EVENTS: Event[] = [
    {
        id: 1,
        title: 'Regional Competition',
        date: '2024-12-15',
        time: '9:00 AM',
        location: 'Tech Arena',
        description: 'Annual regional robotics competition',
        gatherAvailability: true,
        attendees: [
            { id: 1, name: 'Sarah Chen', status: 'available' },
            { id: 2, name: 'Mike Johnson', status: 'not-available' },
            { id: 3, name: 'Emily Davis', status: 'pending' },
            { id: 4, name: 'Alex Kim', status: 'available' },
            { id: 5, name: 'Jordan Lee', status: 'pending' },
            { id: 6, name: 'Taylor Swift', status: 'available' },
        ]
    },
    {
        id: 2,
        title: 'Team Practice',
        date: '2024-11-25',
        time: '3:00 PM',
        location: 'Workshop',
        description: 'Weekly practice and robot testing',
        gatherAvailability: true,
        attendees: [
            { id: 1, name: 'Sarah Chen', status: 'available' },
            { id: 2, name: 'Mike Johnson', status: 'available' },
            { id: 3, name: 'Emily Davis', status: 'pending' },
            { id: 4, name: 'Alex Kim', status: 'available' },
            { id: 5, name: 'Jordan Lee', status: 'pending' },
            { id: 6, name: 'Taylor Swift', status: 'not-available' },
        ]
    },
    {
        id: 3,
        title: 'Design Review',
        date: '2024-11-28',
        time: '2:00 PM',
        location: 'Meeting Room',
        description: 'Review CAD designs and mechanical improvements',
        gatherAvailability: false,
        attendees: []
    },
];

const INITIAL_ACTIVITIES: Activity[] = [
    { id: 1, user: 'Sarah Chen', action: 'uploaded new CAD design', time: '2 hours ago', avatar: 'SC' },
    { id: 2, user: 'Mike Johnson', action: 'completed autonomous code module', time: '5 hours ago', avatar: 'MJ' },
    { id: 3, user: 'Emily Davis', action: 'updated engineering notebook', time: '1 day ago', avatar: 'ED' },
    { id: 4, user: 'Alex Kim', action: 'scheduled practice session', time: '2 days ago', avatar: 'AK' },
];

const INITIAL_TEAM_MEMBERS: TeamMember[] = [
    { id: 1, name: 'Sarah Chen', role: 'Driver', avatar: 'SC', status: 'online' },
    { id: 2, name: 'Mike Johnson', role: 'Programmer', avatar: 'MJ', status: 'online' },
    { id: 3, name: 'Emily Davis', role: 'Notebook', avatar: 'ED', status: 'offline' },
    { id: 4, name: 'Alex Kim', role: 'Builder', avatar: 'AK', status: 'online' },
    { id: 5, name: 'Jordan Lee', role: 'Coach', avatar: 'JL', status: 'offline' },
    { id: 6, name: 'Taylor Swift', role: 'Adviser', avatar: 'TS', status: 'online' },
];

// --- Context ---

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
    const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
    const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
    const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
    const [teamMembers] = useState<TeamMember[]>(INITIAL_TEAM_MEMBERS);

    const addInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
        const newItem = { ...item, id: Date.now() };
        setInventory([...inventory, newItem]);
        addActivity({
            user: 'Current User', // In real app, get from auth
            action: 'added new item',
            item: item.name
        });
    };

    const updateInventoryItem = (updatedItem: InventoryItem) => {
        setInventory(inventory.map(item => item.id === updatedItem.id ? updatedItem : item));
        // Check if status changed to broken
        const oldItem = inventory.find(i => i.id === updatedItem.id);
        if (oldItem && oldItem.status !== 'broken' && updatedItem.status === 'broken') {
            addActivity({
                user: 'Current User',
                action: 'marked item as broken',
                item: updatedItem.name
            });
        }
    };

    const deleteInventoryItem = (id: number) => {
        setInventory(inventory.filter(item => item.id !== id));
    };

    const addEvent = (event: Omit<Event, 'id'>) => {
        const newEvent = { ...event, id: Date.now() };
        setEvents([...events, newEvent]);
        addActivity({
            user: 'Current User',
            action: 'created event',
            item: event.title
        });
    };

    const updateEvent = (updatedEvent: Event) => {
        setEvents(events.map(event => event.id === updatedEvent.id ? updatedEvent : event));
    };

    const deleteEvent = (id: number) => {
        setEvents(events.filter(event => event.id !== id));
    };

    const addActivity = (activity: Omit<Activity, 'id' | 'time'>) => {
        const newActivity = {
            ...activity,
            id: Date.now(),
            time: 'Just now',
            avatar: 'CU' // Current User placeholder
        };
        setActivities([newActivity, ...activities]);
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
            addActivity
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
