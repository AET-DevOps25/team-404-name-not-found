import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MantineProvider } from "@mantine/core";
import { AuthProvider, useAuth } from './context/auth/AuthProvider';
import PrivateRoute from './context/auth/PrivateRoute';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

// Root redirect component
const RedirectFromRoot: React.FC = () => {
    const { user } = useAuth();
    return <Navigate to={user ? "/home" : "/login"} replace />;
};

const App: React.FC = () => {
    return (
        <MantineProvider>
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<RedirectFromRoot />} />
                        <Route path="/login" element={<Login />} />
                        <Route
                            path="/home"
                            element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                </Router>
            </AuthProvider>
        </MantineProvider>
    );
};

export default App;
