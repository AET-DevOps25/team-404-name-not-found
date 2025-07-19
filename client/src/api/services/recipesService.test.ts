import { describe, it, expect, vi, afterEach } from "vitest";
import RecipesService from "@/api/services/recipesService";
import { recipesClient } from "@/api/fetchClients";

vi.mock("@/api/fetchClients", () => ({
    recipesClient: {
        GET: vi.fn(),
        POST: vi.fn(),
        PUT: vi.fn(),
        DELETE: vi.fn(),
    },
}));

describe("RecipesService", () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it("returns mapped recipes on success", async () => {
        (recipesClient.GET as any).mockResolvedValueOnce({
            response: { ok: true },
            data: [
                {
                    id: "1",
                    title: "Test Recipe",
                    description: "desc",
                    cookingTime: 10,
                    difficulty: "easy",
                    ingredients: [{ name: "Tomato", amount: 2, unit: "pcs" }],
                    neededIngredients: [{ name: "Potato", amount: 5, unit: "g" }],
                    instructions: "Do stuff",
                },
            ],
        });
        const result = await RecipesService.getAll();
        expect(result[0]).toMatchObject({
            id: "1",
            title: "Test Recipe",
            description: "desc",
            cookingTime: 10,
            difficulty: "easy",
            instructions: "Do stuff",
            ingredients: [
                { name: "Tomato", quantity: 2, unit: "pcs" },
                { name: "Potato", quantity: 5, unit: "g" },
            ],
        });
    });

    it("throws error if response not ok", async () => {
        (recipesClient.GET as any).mockResolvedValueOnce({
            response: { ok: false, status: 500, statusText: "Server Error" },
            data: null,
        });
        await expect(RecipesService.getAll()).rejects.toThrow("not OK");
    });

    it("throws error if no data returned", async () => {
        (recipesClient.GET as any).mockResolvedValueOnce({
            response: { ok: true },
            data: null,
        });
        await expect(RecipesService.getAll()).rejects.toThrow("data");
    });

    it("generates id if recipe has no id", async () => {
        (recipesClient.GET as any).mockResolvedValueOnce({
            response: { ok: true },
            data: [
                {
                    title: "No ID Recipe",
                    description: "desc",
                    cookingTime: 10,
                    difficulty: "easy",
                    ingredients: [],
                    neededIngredients: [],
                    instructions: "Do stuff",
                },
            ],
        });
        const result = await RecipesService.getAll();
        expect(result[0].id).toBeDefined(); // Should generate a uuid
    });
});
