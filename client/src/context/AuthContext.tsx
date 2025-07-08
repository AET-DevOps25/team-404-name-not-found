// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/types/authTypes';
import authService from '@/api/services/authService';
import { resetAuthToken, setAuthToken } from "@/api/fetchClient.ts";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        console.log("AuthProvider mounted");

        const token = localStorage.getItem('token');
        if (!token) {
            console.log("AuthProvider no previous token found");
            setLoading(false);
            return;
        }

        setAuthToken(token);

        authService.whoAmi()
            .then((user: User) => setUser(user))
            .catch(() => {
                localStorage.removeItem("token");
                resetAuthToken();
                window.location.replace("/");
            })
            .finally(() => setLoading(false));
    }, []);

    const login = async (token: string) => {
        localStorage.setItem('token', token);
        //onst res = await axios.get<User>('/users/whoami');
        //setUser(res.data);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
