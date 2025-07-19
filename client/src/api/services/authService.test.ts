import { describe, it, expect, vi, afterEach } from "vitest";
import authService from "@/api/services/authService";
import { usersClient } from "@/api/fetchClients";

vi.mock("@/api/fetchClients", () => ({
    usersClient: {
        GET: vi.fn(),
    },
}));

describe("authService.whoAmI", () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it("returns user data when authorized", async () => {
        (usersClient.GET as any).mockResolvedValueOnce({
            response: { ok: true },
            data: { userId: "123" },
        });
        const user = await authService.whoAmI();
        expect(user).toEqual({ userId: "123" });
    });

    it("throws error when not authorized", async () => {
        (usersClient.GET as any).mockResolvedValueOnce({
            response: { ok: false },
            data: null,
        });
        await expect(authService.whoAmI()).rejects.toThrow("User not authorized");
    });

    it("throws error when no user data returned", async () => {
        (usersClient.GET as any).mockResolvedValueOnce({
            response: { ok: true },
            data: null,
        });
        await expect(authService.whoAmI()).rejects.toThrow("No user data returned");
    });
});
