import { describe, it, expect, vi, afterEach } from "vitest";
import ImagesService from "@/api/services/imagesService";
import { imagesClient } from "@/api/fetchClients";

vi.mock("@/api/fetchClients", () => ({
    imagesClient: {
        POST: vi.fn(),
    },
}));

describe("ImagesService.analyzeIngredients", () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it("returns mapped ingredients on success", async () => {
        (imagesClient.POST as any).mockResolvedValueOnce({
            response: { ok: true },
            data: [
                { name: "Tomato", amount: 2, unit: "pcs" },
                { name: "Potato", amount: 5, unit: "g" },
            ],
        });
        const file = new File(["dummy"], "test.png");
        const result = await ImagesService.analyzeIngredients(file);
        expect(result).toEqual([
            { name: "Tomato", quantity: 2, unit: "pcs" },
            { name: "Potato", quantity: 5, unit: "g" },
        ]);
    });

    it("throws error if response not ok", async () => {
        (imagesClient.POST as any).mockResolvedValueOnce({
            response: { ok: false, status: 500, statusText: "Server Error" },
            data: null,
        });
        const file = new File(["dummy"], "test.png");
        await expect(ImagesService.analyzeIngredients(file)).rejects.toThrow("Failed to analyze ingredients");
    });

    it("throws error if no data returned", async () => {
        (imagesClient.POST as any).mockResolvedValueOnce({
            response: { ok: true },
            data: null,
        });
        const file = new File(["dummy"], "test.png");
        await expect(ImagesService.analyzeIngredients(file)).rejects.toThrow("no data");
    });
});
