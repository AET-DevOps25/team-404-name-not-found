import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import IngredientGrid from "@/components/ingredients/IngredientGrid";
import { IngredientWithId } from "@/types/ingredientTypes";
import { TooltipProvider } from "@/components/ui/tooltip";

const ingredients: IngredientWithId[] = [
    { id: "1", name: "Tomato", quantity: 2, unit: "g" as any },
    { id: "2", name: "Potato", quantity: 5, unit: "pcs" as any },
];

const onEditMock = vi.fn();
const onDeleteMock = vi.fn();
const onSelectionChangeMock = vi.fn();

const defaultProps = {
    ingredients,
    onEdit: onEditMock,
    onDelete: onDeleteMock,
    onSelectionChange: onSelectionChangeMock,
};

describe("IngredientGrid", () => {
    beforeAll(() => {
        // Mock document.elementFromPoint, da jsdom dies nicht unterstützt
        if (!document.elementFromPoint) {
            document.elementFromPoint = () => null;
        }
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders all ingredients", () => {
        render(
            <TooltipProvider>
                <IngredientGrid {...defaultProps} />
            </TooltipProvider>
        );
        expect(screen.getByText("Tomato")).toBeInTheDocument();
        expect(screen.getByText("Potato")).toBeInTheDocument();
    });
});
