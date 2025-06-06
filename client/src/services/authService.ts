// Dummy for now!
import axiosClient from './axiosClient';
import type { LoginData, RegisterData } from "@/types/authTypes.ts";

export async function login(data: LoginData) {
    try {
        const res = await axiosClient.post('/login', data);
        return res.data;
    } catch (err: any) {
        throw new Error(err.response?.data?.message || 'Login failed');
    }
}

export async function register(data: RegisterData) {
    try {
        const res = await axiosClient.post('/register', data);
        return res.data;
    } catch (err: any) {
        throw new Error(err.response?.data?.message || 'Registration failed');
    }
}

