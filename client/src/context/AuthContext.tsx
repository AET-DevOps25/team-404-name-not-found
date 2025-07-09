// src/context/AuthContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/types/authTypes';
import authService from '@/api/services/authService';
import { getAuthToken, isAuthTokenSet, resetAuthToken, setAuthToken } from "@/api/fetchClient.ts";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string) => Promise<void>;
    tryLoginWithStoredToken: () => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const tryLoginWithStoredToken = async () => {
        if (!isAuthTokenSet()) {
            console.log("AuthProvider: no auth token found, skipping login");
            throw new Error("No auth token found");
        }
        return login(getAuthToken());
    }

    const login = async (token: string) => {
        console.log("AuthProvider: login")

        setAuthToken(token);

        console.log("AuthProvider: checking whoAmI with token");
        return authService.whoAmi()
            .then((user: User) => {
                setUser(user);
                console.log("AuthProvider: whoAmI correct, userId:", user.userId);
            })
            .catch((error) => {
                resetAuthToken();
                throw error;
            })
            .finally(() => setLoading(false));
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, tryLoginWithStoredToken, logout }}>
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
