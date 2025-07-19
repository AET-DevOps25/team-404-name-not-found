import { describe, it, beforeEach, expect } from "vitest";
import { getNumberOfRecipesToGenerate, setNumberOfRecipesToGenerate } from "./settings";

describe("settings utils", () => {
    beforeEach(() => {
        setNumberOfRecipesToGenerate(3);
    });

    it("gets default number of recipes", () => {
        expect(getNumberOfRecipesToGenerate()).toBe(3);
    });

    it("sets number of recipes", () => {
        setNumberOfRecipesToGenerate(5);
        expect(getNumberOfRecipesToGenerate()).toBe(5);
    });
});
