import type User from "./User.ts";
import { createContext } from "react";

export interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const throwNotProvided = () => {
    throw new Error("AuthContext is not provided");
};

const defaultAuthContext: AuthContextType = {
    user: null,
    login: throwNotProvided,
    logout: throwNotProvided,
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);
