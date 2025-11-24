import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TeamMember } from './DataContext';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string) => Promise<boolean>;
    signup: (name: string, email: string, role: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('vex_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = async (email: string) => {
        try {
            // In a real app, we would verify password here.
            // For now, we just check if the user exists in our team_members table
            const res = await fetch('/api/db?table=team_members');
            const members: TeamMember[] = await res.json();

            // Find member by name (since we don't have email in team_members table yet, 
            // we might need to rely on name or add email to team_members schema later.
            // For this demo, let's assume we match by name or just simulate login)

            // actually, let's just look for a member with a matching name for now as a fallback
            // or better, let's just allow login if we find them.

            // Wait, the team_members table doesn't have email. 
            // We should probably add email to team_members or just store it locally.
            // For now, to make it work with existing schema:

            const foundMember = members.find(m => m.name.toLowerCase() === email.toLowerCase() || m.name.toLowerCase().includes(email.split('@')[0].toLowerCase()));

            if (foundMember) {
                const userData = {
                    id: foundMember.id,
                    name: foundMember.name,
                    email: email,
                    role: foundMember.role,
                    avatar: foundMember.avatar || foundMember.name.substring(0, 2).toUpperCase()
                };
                setUser(userData);
                localStorage.setItem('vex_user', JSON.stringify(userData));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const signup = async (name: string, email: string, role: string) => {
        // 1. Create avatar initials
        const avatar = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

        // 2. Add to team_members table via API
        try {
            const newMember = {
                name,
                role,
                status: 'online',
                avatar
            };

            const res = await fetch('/api/db?table=team_members', { // Note: we need to handle POST for team_members in API
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMember)
            });

            if (res.ok) {
                const savedMember = await res.json();
                const userData = {
                    id: savedMember.id,
                    name: savedMember.name,
                    email: email,
                    role: savedMember.role,
                    avatar: savedMember.avatar
                };
                setUser(userData);
                localStorage.setItem('vex_user', JSON.stringify(userData));
            } else {
                console.error('Failed to save team member');
            }
        } catch (error) {
            console.error('Signup error:', error);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('vex_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
