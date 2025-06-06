import { useState } from 'react';
import LoginScreen from '../components/LoginScreen';

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

    return null;
    //return <Dashboard onLogout={handleLogout} />;
};

export default Index;
