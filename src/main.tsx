import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import SignIn from './pages/SignIn.tsx';
import SignUp from './pages/SignUp.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Events from './pages/Events.tsx';
import Inventory from './pages/Inventory.tsx';
import Reports from './pages/Reports.tsx';
import Settings from './pages/Settings.tsx';
import ThemeTest from './pages/ThemeTest.tsx';
import Layout from './components/Layout.tsx';
import './index.css';

import { DataProvider } from './context/DataContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AuthProvider>
            <DataProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<App />} />
                        <Route path="/signin" element={<SignIn />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route element={<Layout />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/events" element={<Events />} />
                            <Route path="/inventory" element={<Inventory />} />
                            <Route path="/reports" element={<Reports />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/test" element={<ThemeTest />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </DataProvider>
        </AuthProvider>
    </React.StrictMode>,
);
