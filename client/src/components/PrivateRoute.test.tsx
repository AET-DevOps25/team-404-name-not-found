import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import PrivateRoute from "@/components/PrivateRoute";
import { useAuth } from "@/context/AuthContext";
import { MemoryRouter } from "react-router-dom";

vi.mock("@/context/AuthContext", () => ({
    useAuth: vi.fn(),
}));

const mockedUseAuth = useAuth as unknown as ReturnType<typeof vi.fn>;

describe("PrivateRoute", () => {
    it("renders children if user is authenticated", () => {
        mockedUseAuth.mockReturnValue({ user: { userId: "1" }, loading: false });
        render(
            <MemoryRouter>
                <PrivateRoute>
                    <div>Protected Content</div>
                </PrivateRoute>
            </MemoryRouter>
        );
        expect(screen.getByText("Protected Content")).toBeInTheDocument();
    });

    it("shows loading if loading is true", () => {
        mockedUseAuth.mockReturnValue({ user: null, loading: true });
        render(
            <MemoryRouter>
                <PrivateRoute>
                    <div>Protected Content</div>
                </PrivateRoute>
            </MemoryRouter>
        );
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it("redirects to / if user is not authenticated", () => {
        mockedUseAuth.mockReturnValue({ user: null, loading: false });
        render(
            <MemoryRouter>
                <PrivateRoute>
                    <div>Protected Content</div>
                </PrivateRoute>
            </MemoryRouter>
        );
        expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    });
});
