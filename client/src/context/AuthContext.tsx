// src/context/AuthContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";
import { User } from "@/types/authTypes";
import authService from "@/api/services/authService";
import { getAuthToken, isAuthTokenSet, resetAuthToken, setAuthToken } from "@/api/fetchClient.ts";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    loginDevMode: () => Promise<void>;
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
    };

    const checkToken = async () => {
        console.log("AuthProvider: checking token with whoAmI");
        return authService
            .whoAmi()
            .then((user: User) => {
                setUser(user);
                console.log("AuthProvider: whoAmI correct setting User, userId:", user.userId);
            })
            .catch((error) => {
                resetAuthToken();
                throw error;
            });
    };

    const loginDevMode = async () => {
        console.log("AuthProvider: login");
        // We don't need to set the token in dev mode, they auth backend accepts it without it
        setLoading(true);
        return checkToken().finally(() => setLoading(false));
    };

    const login = async (token: string) => {
        console.log("AuthProvider: login");

        setAuthToken(token);

        console.log("AuthProvider: checking whoAmI with token");
        setLoading(true);
        return checkToken().finally(() => setLoading(false));
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginDevMode, login, tryLoginWithStoredToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
