import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../../services/authService';
import { useGoogleLogin } from '@react-oauth/google';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, Loader2 } from "lucide-react";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await AuthService.login(username, password);
            navigate('/');
            window.location.reload();
        } catch (err) {
            setError(err.response?.data || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setLoading(true);
            setError('');
            try {
                await AuthService.googleLogin(tokenResponse.access_token);
                navigate('/');
                window.location.reload();
            } catch (err) {
                setError('Google Sign-In failed. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        },
        onError: () => {
            setError('Google Sign-In failed.');
        }
    });

    return (
        <div className="min-h-screen py-12 flex items-center justify-center bg-muted/30">
            <div className="w-full max-w-md px-4">
                <Card className="border-none shadow-xl bg-card/80 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-10 duration-500">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                            Welcome Back
                        </CardTitle>
                        <CardDescription>
                            Sign in to your IndiaDrive account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4 flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground">Remember me</Label>
                                </div>
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Sign In
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={() => loginWithGoogle()}
                                disabled={loading}
                            >
                                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="mr-2 h-4 w-4" />
                                Google
                            </Button>

                            <div className="text-center text-sm text-muted-foreground mt-4">
                                Don't have an account?{" "}
                                <Link to="/register" className="font-semibold text-primary hover:underline">
                                    Sign Up
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Login;
