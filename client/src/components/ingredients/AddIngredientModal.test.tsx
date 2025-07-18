import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import AddIngredientModal from "@/components/ingredients/AddIngredientModal";

const onCloseMock = vi.fn();
const onAddMock = vi.fn();

const defaultProps = {
    onClose: onCloseMock,
    onAdd: onAddMock,
};

describe("AddIngredientModal", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders input fields and buttons", () => {
        render(<AddIngredientModal {...defaultProps} />);
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/quantity/i)).toBeInTheDocument();

        expect(screen.getByText(/unit/i)).toBeInTheDocument();
        expect(screen.getByRole("combobox")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    });

    it("calls onAdd with correct data when form is submitted", () => {
        render(<AddIngredientModal {...defaultProps} />);
        fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Tomato" } });
        fireEvent.change(screen.getByLabelText(/quantity/i), { target: { value: "2" } });

        const select = document.querySelector("select");
        fireEvent.change(select!, { target: { value: "g" } });
        fireEvent.click(screen.getByRole("button", { name: /add/i }));
        expect(onAddMock).toHaveBeenCalledWith({ name: "Tomato", quantity: 2, unit: "g" });
    });

    it("does not call onAdd if name or quantity is missing", () => {
        render(<AddIngredientModal {...defaultProps} />);
        fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "" } });
        fireEvent.change(screen.getByLabelText(/quantity/i), { target: { value: "" } });
        fireEvent.click(screen.getByRole("button", { name: /add/i }));
        expect(onAddMock).not.toHaveBeenCalled();
    });

    it("calls onClose when cancel button is clicked", () => {
        render(<AddIngredientModal {...defaultProps} />);
        fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
        expect(onCloseMock).toHaveBeenCalled();
    });
});
