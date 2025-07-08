import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip.tsx";
import NotFound from "@/pages/NotFound.tsx";
import LoginScreen from "@/pages/LoginScreen.tsx";
import Dashboard from "@/pages/Dashboard.tsx";
import OAuthCallback from "@/pages/OAuthCallback.tsx";
import PrivateRoute from "@/components/PrivateRoute.tsx";

const App: React.FC = () => {
    return (
        <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
                <Routes>
                    <Route path="/ui/v1/callback" element={<OAuthCallback />} />
                    <Route path="/dashboard" element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    } />
                    <Route path="/" element={<LoginScreen />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </TooltipProvider>
    );
};

export default App;
