import { describe, it, vi, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ScanImageModal from "./ScanImageModal";

Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

describe("ScanImageModal", () => {
    it("renders without crashing", () => {
        render(<ScanImageModal onClose={() => {}} onAddToFridge={() => {}} onAddAndGenerateRecipes={() => {}} />);
    });
    it("renders title and buttons", () => {
        render(<ScanImageModal onClose={() => {}} onAddToFridge={() => {}} onAddAndGenerateRecipes={() => {}} />);
        expect(screen.getByText("Scan Fridge")).toBeInTheDocument();
        expect(screen.getByText(/Upload Photo|Take Photo/)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
    });
});
