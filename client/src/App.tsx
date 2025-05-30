import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/auth/AuthProvider';
import Index from "./pages/Index.tsx";

const App: React.FC = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Index/>} />
                    <Route path="*" element={<Navigate to="/"/>} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;
