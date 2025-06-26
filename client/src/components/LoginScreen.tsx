import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Refrigerator } from "lucide-react";

interface LoginScreenProps {
    onLogin: () => void;
}

const LoginScreen = ({ onLogin }: LoginScreenProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            onLogin();
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
                        <Tabs defaultValue="login" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="login">Login</TabsTrigger>
                                <TabsTrigger value="register">Register</TabsTrigger>
                            </TabsList>

                            <TabsContent value="login">
                                <form onSubmit={handleSubmit} className="space-y-4 min-h-[240px]">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Enter your email"
                                            required
                                            className="border-gray-200 focus:border-green-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Enter your password"
                                            required
                                            className="border-gray-200 focus:border-green-500"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Signing in..." : "Sign in"}
                                    </Button>
                                </form>
                            </TabsContent>

                            <TabsContent value="register">
                                <form onSubmit={handleSubmit} className="space-y-4 min-h-[240px]">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            placeholder="Enter your name"
                                            required
                                            className="border-gray-200 focus:border-green-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email-register">Email</Label>
                                        <Input
                                            id="email-register"
                                            type="email"
                                            placeholder="Enter your email"
                                            required
                                            className="border-gray-200 focus:border-green-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password-register">Password</Label>
                                        <Input
                                            id="password-register"
                                            type="password"
                                            placeholder="Create a password"
                                            required
                                            className="border-gray-200 focus:border-green-500"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Creating account..." : "Create account"}
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default LoginScreen;
