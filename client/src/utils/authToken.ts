const TOKEN_KEY = "token";

export const setAuthToken = (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
};

export const resetAuthToken = (): void => {
    localStorage.removeItem(TOKEN_KEY);
};

export const getAuthToken = (): string => {
    const token = getAuthTokenOrNull();
    if (!token) {
        throw new Error("No auth token found");
    }
    return token;
};

export const getAuthTokenOrNull = (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
};

export const isAuthTokenSet = (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
};
