import { useState } from "react";
import LoginScreen from "@/pages/LoginScreen.tsx";
import Dashboard from "@/pages/Dashboard.tsx";

const Index = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    // @ts-ignore
    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    if (!isAuthenticated) {
        return <LoginScreen onLogin={handleLogin} />;
    }

    return <Dashboard onLogout={handleLogout} />;
};

export default Index;
