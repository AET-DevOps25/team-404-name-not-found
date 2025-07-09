import createClient, { type Middleware } from "openapi-fetch";
import type { paths as UsersPaths } from "@/api/users";
import type { paths as RecipesPaths } from "@/api/recipes";
import { recipesApiBaseUrl, usersApiBaseUrl } from "@/api/baseUrl.ts";

const authTokenMiddleware: Middleware = {
    async onRequest({ request }) {
        const token = localStorage.getItem("token");
        if (token) {
            request.headers.set("Authorization", `Bearer ${token}`);
        }

        return request;
    },
};

const unauthorizedResponseRedirectMiddleware: Middleware = {
    async onResponse({ response }) {
        if (response.status === 401 || response.status === 403) {
            // Handle unauthorized access, e.g., redirect to login
            console.warn("Unauthorized access - token may be invalid or expired. Redirecting to login.");
            window.location.replace("/");
        }
        return response;
    },
};

export const setAuthToken = (token: string): void => {
    localStorage.setItem("token", token);
};

export const resetAuthToken = (): void => {
    localStorage.removeItem("token");
};

export const getAuthToken = (): string => {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("No auth token found");
    }
    return token;
};

export const isAuthTokenSet = (): boolean => {
    return !!localStorage.getItem("token");
};

export const usersClient = createClient<UsersPaths>({ baseUrl: usersApiBaseUrl });
export const recipesClient = createClient<RecipesPaths>({ baseUrl: recipesApiBaseUrl });

usersClient.use(authTokenMiddleware);
recipesClient.use(authTokenMiddleware);
recipesClient.use(unauthorizedResponseRedirectMiddleware);

console.log("Users client created with base URL:", usersApiBaseUrl);
console.log("Recipes client created with base URL:", recipesApiBaseUrl);
