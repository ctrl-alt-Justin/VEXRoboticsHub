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
    login: (email: string, password: string) => Promise<boolean>;
    signup: (name: string, email: string, password: string, role: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('vex_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = async (email: string, password: string) => {
        try {
            // Call authentication API endpoint
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (res.ok) {
                const userData = await res.json();
                const user: User = {
                    id: userData.id,
                    name: userData.name,
                    email: userData.email,
                    role: userData.role,
                    avatar: userData.avatar || userData.name.substring(0, 2).toUpperCase()
                };
                setUser(user);
                localStorage.setItem('vex_user', JSON.stringify(user));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const signup = async (name: string, email: string, password: string, role: string) => {
        // Create avatar initials
        const avatar = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

        try {
            const newMember = {
                name,
                email,
                password,
                role,
                status: 'online',
                avatar
            };

            const res = await fetch('/api/db?table=team_members', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMember)
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to create account');
            }

            // Don't auto-login after signup, let user sign in
            // const savedMember = await res.json();
            // ... removed auto-login code
        } catch (error) {
            console.error('Signup error:', error);
            throw error;
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
