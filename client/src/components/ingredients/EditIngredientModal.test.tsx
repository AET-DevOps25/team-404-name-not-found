import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import EditIngredientModal from "@/components/ingredients/EditIngredientModal";

const onCloseMock = vi.fn();
const onSaveMock = vi.fn();

const defaultProps = {
    ingredient: { id: "1", name: "Tomato", quantity: 2, unit: "g" as any },
    onClose: onCloseMock,
    onSave: onSaveMock,
};

describe("EditIngredientModal", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders input fields and buttons with initial values", () => {
        render(<EditIngredientModal {...defaultProps} />);
        expect(screen.getByDisplayValue("Tomato")).toBeInTheDocument();
        expect(screen.getByDisplayValue("2")).toBeInTheDocument();
        expect(screen.getByDisplayValue("g")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    });

    it("calls onSave with correct data when form is submitted", () => {
        render(<EditIngredientModal {...defaultProps} />);
        fireEvent.change(screen.getByDisplayValue("Tomato"), { target: { value: "Potato" } });
        fireEvent.change(screen.getByDisplayValue("2"), { target: { value: "5" } });
        fireEvent.change(screen.getByDisplayValue("g"), { target: { value: "ml" } });
        fireEvent.click(screen.getByRole("button", { name: /save/i }));
        expect(onSaveMock).toHaveBeenCalledWith({ id: "1", name: "Potato", quantity: 5, unit: "ml" as any });
    });

    it("does not call onSave if name or quantity is missing", () => {
        render(<EditIngredientModal {...defaultProps} />);
        fireEvent.change(screen.getByDisplayValue("Tomato"), { target: { value: "" } });
        fireEvent.change(screen.getByDisplayValue("2"), { target: { value: "" } });
        fireEvent.click(screen.getByRole("button", { name: /save/i }));
        expect(onSaveMock).not.toHaveBeenCalled();
    });

    it("calls onClose when cancel button is clicked", () => {
        render(<EditIngredientModal {...defaultProps} />);
        fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
        expect(onCloseMock).toHaveBeenCalled();
    });
});
