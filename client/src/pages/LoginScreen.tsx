import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Refrigerator } from "lucide-react";
import GithubLoginButton from "@/components/login/GithubLoginButton.tsx";

const LoginScreen = () => {
    // @ts-ignore
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    };

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
                            <GithubLoginButton onClick={handleSubmit}/>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default LoginScreen;
