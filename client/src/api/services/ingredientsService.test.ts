import { describe, it, expect, vi, afterEach } from "vitest";
import IngredientsService from "@/api/services/ingredientsService";
import { ingredientsClient } from "@/api/fetchClients";

vi.mock("@/api/fetchClients", () => ({
    ingredientsClient: {
        GET: vi.fn(),
    },
}));

describe("IngredientsService.getAll", () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it("returns mapped ingredients on success", async () => {
        (ingredientsClient.GET as any).mockResolvedValueOnce({
            response: { ok: true },
            data: [
                { id: "1", name: "Tomato", amount: 2, unit: "pcs" },
                { id: "2", name: "Potato", amount: 5, unit: "g" },
            ],
        });
        const result = await IngredientsService.getAll();
        expect(result).toEqual([
            { id: "1", name: "Tomato", quantity: 2, unit: "pcs" },
            { id: "2", name: "Potato", quantity: 5, unit: "g" },
        ]);
    });

    it("throws error if response not ok", async () => {
        (ingredientsClient.GET as any).mockResolvedValueOnce({
            response: { ok: false, status: 500, statusText: "Server Error" },
            data: null,
        });
        await expect(IngredientsService.getAll()).rejects.toThrow("response is not OK");
    });

    it("throws error if no data returned", async () => {
        (ingredientsClient.GET as any).mockResolvedValueOnce({
            response: { ok: true },
            data: null,
        });
        await expect(IngredientsService.getAll()).rejects.toThrow("no data");
    });

    it("throws error if ingredient has no id", async () => {
        (ingredientsClient.GET as any).mockResolvedValueOnce({
            response: { ok: true },
            data: [{ name: "Tomato", amount: 2, unit: "pcs" }],
        });
        await expect(IngredientsService.getAll()).rejects.toThrow("id");
    });
});
