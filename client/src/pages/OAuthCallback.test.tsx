import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import OAuthCallback from "@/pages/OAuthCallback";

const navigateMock = vi.fn();
const loginMock = vi.fn();

vi.mock("@/context/AuthContext", () => ({
    useAuth: () => ({
        login: loginMock,
    }),
}));
vi.mock("react-router-dom", () => ({
    useNavigate: () => navigateMock,
}));

describe("OAuthCallback", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("navigates to dashboard on successful login", async () => {
        loginMock.mockResolvedValueOnce(undefined);
        window.history.pushState({}, "", "/oauth-callback?token=abc123");
        render(<OAuthCallback />);
        await waitFor(() => {
            expect(loginMock).toHaveBeenCalledWith("abc123");
            expect(navigateMock).toHaveBeenCalledWith("/dashboard");
        });
    });

    it("navigates to / on failed login", async () => {
        loginMock.mockRejectedValueOnce(new Error("invalid token"));
        window.history.pushState({}, "", "/oauth-callback?token=abc123");
        render(<OAuthCallback />);
        await waitFor(() => {
            expect(loginMock).toHaveBeenCalledWith("abc123");
            expect(navigateMock).toHaveBeenCalledWith("/");
        });
    });

    it("navigates to / if no token is present", async () => {
        window.history.pushState({}, "", "/oauth-callback");
        render(<OAuthCallback />);
        await waitFor(() => {
            expect(navigateMock).toHaveBeenCalledWith("/");
        });
    });
});
