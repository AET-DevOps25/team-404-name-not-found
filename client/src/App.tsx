import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/context/auth/AuthProvider";
import { TooltipProvider } from "@/components/ui/tooltip.tsx";
import Index from "@/pages/Index.tsx";
import NotFound from "@/pages/NotFound.tsx";

const App: React.FC = () => {
    return (
        <AuthProvider>
            <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </BrowserRouter>
            </TooltipProvider>
        </AuthProvider>
    );
};

export default App;
