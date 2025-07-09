const baseUrl: string = import.meta.env.VITE_API_BASE_URL || "/api";

export const usersApiBaseUrl = `${baseUrl}/users`;
export const recipesApiBaseUrl = `${baseUrl}/recipes`;
