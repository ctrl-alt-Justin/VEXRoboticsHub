import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Initialize Supabase client
// Note: We use the service role key here for admin access (server-side only)
const supabase = createClient(supabaseUrl, serviceKey);

export default async function handler(req: any, res: any) {
    const { method, query } = req;
    const table = query.table as string;

    // Basic validation
    if (!table) {
        return res.status(400).json({ error: 'Missing table parameter' });
    }

    try {
        // --- INVENTORY ---
        if (table === 'inventory') {
            if (method === 'GET') {
                const { data, error } = await supabase.from('inventory').select('*').order('id', { ascending: true });
                if (error) throw error;
                return res.status(200).json(data);
            }
            if (method === 'POST') {
                const { name, control_id, quantity, status, type } = req.body;
                const { data, error } = await supabase.from('inventory').insert([{ name, control_id, quantity, status, type }]).select().single();
                if (error) throw error;
                return res.status(201).json(data);
            }
            if (method === 'PUT') {
                const { id, ...updates } = req.body;
                const { data, error } = await supabase.from('inventory').update(updates).eq('id', id).select().single();
                if (error) throw error;
                return res.status(200).json(data);
            }
            if (method === 'DELETE') {
                const { id } = query;
                const { error } = await supabase.from('inventory').delete().eq('id', id);
                if (error) throw error;
                return res.status(204).end();
            }
        }

        // --- EVENTS ---
        if (table === 'events') {
            if (method === 'GET') {
                // Get events and their attendees
                const { data: events, error: eventsError } = await supabase.from('events').select('*').order('event_date', { ascending: true });
                if (eventsError) throw eventsError;

                const { data: attendees, error: attendeesError } = await supabase.from('event_attendees').select('*');
                if (attendeesError) throw attendeesError;

                // Combine them
                const eventsWithAttendees = events.map((event: any) => ({
                    ...event,
                    attendees: attendees.filter((a: any) => a.event_id === event.id)
                }));
                return res.status(200).json(eventsWithAttendees);
            }
            if (method === 'POST') {
                const { title, event_date, event_time, location, description, gather_availability, attendees } = req.body;

                // 1. Create Event
                const { data: event, error: eventError } = await supabase.from('events').insert([{
                    title, event_date, event_time, location, description, gather_availability
                }]).select().single();
                if (eventError) throw eventError;

                // 2. Create Attendees if any
                if (attendees && attendees.length > 0) {
                    const attendeesWithId = attendees.map((a: any) => ({
                        ...a,
                        event_id: event.id
                    }));
                    const { error: attError } = await supabase.from('event_attendees').insert(attendeesWithId);
                    if (attError) throw attError;
                }

                return res.status(201).json(event);
            }
        }

        // --- ACTIVITIES ---
        if (table === 'activities') {
            if (method === 'GET') {
                const { data, error } = await supabase.from('activities').select('*').order('time', { ascending: false }).limit(50);
                if (error) throw error;
                return res.status(200).json(data);
            }
            if (method === 'POST') {
                const { user_name, action, item, avatar } = req.body;
                const { data, error } = await supabase.from('activities').insert([{ user_name, action, item, avatar }]).select().single();
                if (error) throw error;
                return res.status(201).json(data);
            }
        }

        // --- TEAM MEMBERS ---
        if (table === 'team_members') {
            if (method === 'GET') {
                const { data, error } = await supabase.from('team_members').select('*').order('name');
                if (error) throw error;
                return res.status(200).json(data);
            }
            if (method === 'POST') {
                const { name, email, password, role, status, avatar } = req.body;

                // Validate required fields
                if (!email || !password) {
                    return res.status(400).json({ error: 'Email and password are required' });
                }

                // Hash password
                const saltRounds = 10;
                const password_hash = await bcrypt.hash(password, saltRounds);

                // Insert user with hashed password
                const { data, error } = await supabase.from('team_members').insert([{
                    name,
                    email: email.toLowerCase(),
                    password_hash,
                    role,
                    status: status || 'online',
                    avatar
                }]).select().single();

                if (error) throw error;

                // Return user data without password hash
                const { password_hash: _, ...userData } = data;
                return res.status(201).json(userData);
            }
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (error: any) {
        console.error('API Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
