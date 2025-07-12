import createClient, { type Middleware } from "openapi-fetch";
import type { paths as UsersPaths } from "@/api/users";
import type { paths as RecipesPaths } from "@/api/recipes";
import type { paths as IngredientsPaths } from "@/api/ingredients";
import type { paths as ImagesPaths } from "@/api/images";
import { imagesApiBaseUrl, ingredientsApiBaseUrl, recipesApiBaseUrl, usersApiBaseUrl } from "@/api/baseUrl";
import { getAuthTokenOrNull } from "@/utils/authToken";

const authTokenMiddleware: Middleware = {
    async onRequest({ request }) {
        const token = getAuthTokenOrNull();
        if (token) {
            request.headers.set("Authorization", `Bearer ${token}`);
        }

        return request;
    },
};

const unauthorizedResponseRedirectMiddleware: Middleware = {
    async onResponse({ response }) {
        if (response.status === 401 || response.status === 403) {
            console.warn("Unauthorized access - token may be invalid or expired. Redirecting to login.");
            window.location.replace("/");
        }
        return response;
    },
};

function createApiClient<TPaths extends {}>(baseUrl: string, redirectOnUnauthorized = true) {
    const client = createClient<TPaths>({ baseUrl: baseUrl });
    client.use(authTokenMiddleware);
    if (redirectOnUnauthorized) {
        client.use(unauthorizedResponseRedirectMiddleware);
    }

    console.log(`API client created with base URL: ${baseUrl}`);

    return client;
}

export const usersClient = createApiClient<UsersPaths>(usersApiBaseUrl, false);
export const recipesClient = createApiClient<RecipesPaths>(recipesApiBaseUrl);
export const ingredientsClient = createApiClient<IngredientsPaths>(ingredientsApiBaseUrl);
export const imagesClient = createApiClient<ImagesPaths>(imagesApiBaseUrl);
