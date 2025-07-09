import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Refrigerator } from "lucide-react";
import GithubLoginButton from "@/components/login/GithubLoginButton.tsx";
import { usersApiBaseUrl } from "@/api/baseUrl.ts";
import { useAuth } from "@/context/AuthContext.tsx";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast.ts";
import { useNavigate } from "react-router-dom";

const LoginScreen = () => {
    // @ts-ignore
    const { user, loading, login, tryLoginWithStoredToken } = useAuth();
    const navigate = useNavigate();

    const isDevMode = import.meta.env.VITE_MODE === "dev";

    const loginDevUser = () => {
        login("dummy-token-for-dev-user")
            .then(() => navigate("/dashboard"))
            .catch((error) => {
                console.error("Login as dev user failed:", error);
                toast({
                    variant: "destructive",
                    title: "Login Failed",
                    description:
                        "Failed to log in as dev user. Are the server services in dev mode? Check console for details.",
                });
            });
    };

    const onLoginButtonClick = () => {
        if (isDevMode) {
            toast({
                variant: "destructive",
                title: "DEV MODE",
                description: "Dev mode is activated. Logging in as dev user.",
            });
            setTimeout(loginDevUser, 2000);
        } else {
            // Redirect to GitHub OAuth login
            window.location.href = `${usersApiBaseUrl}/login`;
        }
    };

    useEffect(() => {
        console.log("LoginScreen: mounted");

        if (user) {
            console.log("LoginScreen: user already logged in, redirecting to /dashboard");
            navigate("/dashboard");
        } else {
            // Try logging in with stored token if available
            console.log("LoginScreen: checking for stored token");
            tryLoginWithStoredToken()
                .then(() => {
                    console.log("LoginScreen: user logged in with stored token, redirecting to /dashboard");
                    navigate("/dashboard");
                })
                .catch(() => {
                    console.log("LoginScreen: no stored token or login failed, staying on login screen");
                });
        }
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
                        <Refrigerator className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">What's In My Fridge</h1>
                    <p className="text-gray-600 mt-2">Turn your ingredients into amazing meals</p>
                </div>

                {/* Login/Register Form */}
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-center text-gray-900">Welcome back</CardTitle>
                        <CardDescription className="text-center">
                            Sign in to your account or create a new one
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full">
                            <GithubLoginButton onClick={onLoginButtonClick} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default LoginScreen;
