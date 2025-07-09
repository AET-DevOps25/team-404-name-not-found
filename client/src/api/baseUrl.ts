const baseUrl: string = import.meta.env.VITE_API_BASE_URL || "/api";

export const usersApiBaseUrl = `${baseUrl}/users`;
export const recipesApiBaseUrl = `${baseUrl}/recipes`;
export const imagesApiBaseUrl = `${baseUrl}/images/v1`;
export const ingredientsApiBaseUrl = `${baseUrl}/ingredients/v1`;
