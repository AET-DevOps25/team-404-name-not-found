import { describe, it, beforeEach, expect } from "vitest";
import { setAuthToken, resetAuthToken, getAuthToken, getAuthTokenOrNull, isAuthTokenSet } from "./authToken";

describe("authToken utils", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("sets and gets token", () => {
        setAuthToken("abc123");
        expect(getAuthToken()).toBe("abc123");
        expect(getAuthTokenOrNull()).toBe("abc123");
        expect(isAuthTokenSet()).toBe(true);
    });

    it("resets token", () => {
        setAuthToken("abc123");
        resetAuthToken();
        expect(getAuthTokenOrNull()).toBeNull();
        expect(isAuthTokenSet()).toBe(false);
    });

    it("throws if token not set", () => {
        expect(() => getAuthToken()).toThrow("No auth token found");
    });
});
