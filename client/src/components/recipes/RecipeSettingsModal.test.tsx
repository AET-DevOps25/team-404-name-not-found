import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import RecipeSettingsModal from "./RecipeSettingsModal";
import { setNumberOfRecipesToGenerate } from "@/utils/settings";

vi.mock("@/utils/settings", () => ({
    getNumberOfRecipesToGenerate: vi.fn(() => 5),
    setNumberOfRecipesToGenerate: vi.fn(),
}));

describe("RecipeSettingsModal", () => {
    it("renders with initial value from settings", () => {
        render(<RecipeSettingsModal onClose={vi.fn()} />);
        expect(screen.getByLabelText(/number/i)).toBeInTheDocument();
        expect(screen.getByDisplayValue("5")).toBeInTheDocument();
    });

    it("calls setNumberOfRecipesToGenerate and onClose on valid save", () => {
        const onClose = vi.fn();
        render(<RecipeSettingsModal onClose={onClose} />);
        const input = screen.getByLabelText(/number/i);
        fireEvent.change(input, { target: { value: "7" } });
        fireEvent.click(screen.getByText(/save/i));
        expect(setNumberOfRecipesToGenerate).toHaveBeenCalledWith(7);
        expect(onClose).toHaveBeenCalled();
    });

    it("shows alert on invalid input", () => {
        window.alert = vi.fn();
        render(<RecipeSettingsModal onClose={vi.fn()} />);
        const input = screen.getByLabelText(/number/i);
        fireEvent.change(input, { target: { value: "-1" } });
        fireEvent.click(screen.getByText(/save/i));
        expect(window.alert).toHaveBeenCalledWith("Please enter a valid number greater than 0");
    });
});
