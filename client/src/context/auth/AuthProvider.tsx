import { useState, useEffect, useContext, type PropsWithChildren } from "react";
import axios from "axios";
import type User from "./User.ts";
import{ AuthContext } from "./AuthContext.ts";

const AUTH_LOCALSTORAGE_ITEM_NAME: string = "token";
const AUTH_HEADER_NAME: string = "Authorization";


export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [user, setUser] = useState<User | null>(null);

    const login = async (email: string, password: string) => {
        const res = await axios.post<{ token: string }>("/auth/login", { email, password });
        const token = res.data.token;

        localStorage.setItem(AUTH_LOCALSTORAGE_ITEM_NAME, token);
        axios.defaults.headers.common[AUTH_HEADER_NAME] = `Bearer ${token}`;

        const me = await axios.get<User>("/auth/me");
        setUser(me.data);
    };

    const logout = () => {
        localStorage.removeItem(AUTH_LOCALSTORAGE_ITEM_NAME);
        delete axios.defaults.headers.common[AUTH_HEADER_NAME];
        setUser(null);
    };

    const loadUser = async () => {
        const token = localStorage.getItem(AUTH_LOCALSTORAGE_ITEM_NAME);
        if (token) {
            axios.defaults.headers.common[AUTH_HEADER_NAME] = `Bearer ${token}`;
            try {
                const me = await axios.get<User>("/auth/me");
                setUser(me.data);
            } catch (error) {
                logout();
            }
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
