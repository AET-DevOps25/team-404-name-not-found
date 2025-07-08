import createClient, { type Middleware } from "openapi-fetch";
import type { paths as UsersPaths } from "@/api/users";
import type { paths as RecipesPaths } from "@/api/recipes";

const baseUrl: string = import.meta.env.VITE_API_BASE_URL || "/api";
let authToken: string | undefined = undefined;

const authTokenMiddleware: Middleware = {
    async onRequest({ request }) {
        if (authToken) {
            request.headers.set("Authorization", `Bearer ${authToken}`);
        }

        return request;
    }
};

const unauthorizedResponseRedirectMiddleware: Middleware = {
    async onResponse({ response }) {
        if (response.status === 401 || response.status === 403) {
            // Handle unauthorized access, e.g., redirect to login
            console.warn("Unauthorized access - token may be invalid or expired. Redirecting to login.");
            window.location.replace("/");
        }
        return response;
    }
};

export const setAuthToken = (token: string) => {
    authToken = token;
};

export const resetAuthToken = () => {
    authToken = undefined;
};

const usersApiBaseUrl = `${baseUrl}/users/`;
const recipesApiBaseUrl = `${baseUrl}/recipes/`;

export const usersClient = createClient<UsersPaths>({ baseUrl: usersApiBaseUrl });
export const recipesClient = createClient<RecipesPaths>({ baseUrl: recipesApiBaseUrl });

usersClient.use(authTokenMiddleware);
recipesClient.use(authTokenMiddleware);
recipesClient.use(unauthorizedResponseRedirectMiddleware);

console.log("Users client created with base URL:", usersApiBaseUrl);
console.log("Recipes client created with base URL:", recipesApiBaseUrl);




