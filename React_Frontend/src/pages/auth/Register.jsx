import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../../services/authService';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, Loader2 } from "lucide-react";

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'CUSTOMER'
    });
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error for this field when user types
        if (fieldErrors[e.target.name]) {
            setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Password: At least 8 chars, at least one special character
        const passwordRegex = /^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;

        if (!formData.username || formData.username.trim().length < 3) {
            newErrors.username = "Username must be at least 3 characters long.";
        }

        if (!formData.email || !emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email address.";
        }

        if (!formData.password) {
            newErrors.password = "Password is required.";
        } else if (!passwordRegex.test(formData.password)) {
            newErrors.password = "Password must be at least 8 characters and contain at least one special character (!@#$%^&*).";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        }

        setFieldErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            await AuthService.register({
                username: formData.username,
                email: formData.email,
                password: formData.password,
                role: formData.role
            });
            navigate('/login', { state: { message: 'Registration successful! Please login.' } });
        } catch (err) {
            setError(err.response?.data || 'Failed to register. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-12 flex items-center justify-center bg-muted/30">
            <div className="w-full max-w-2xl px-4">
                <Card className="border-none shadow-xl bg-card/80 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-10 duration-500">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                            Create Account
                        </CardTitle>
                        <CardDescription>
                            Start your premium journey with IndiaDrive
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4 flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        name="username"
                                        placeholder="Choose a username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                        className={fieldErrors.username ? "border-destructive focus-visible:ring-destructive" : ""}
                                    />
                                    {fieldErrors.username && <p className="text-destructive text-xs">{fieldErrors.username}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className={fieldErrors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                                    />
                                    {fieldErrors.email && <p className="text-destructive text-xs">{fieldErrors.email}</p>}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="Create a password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className={fieldErrors.password ? "border-destructive focus-visible:ring-destructive" : ""}
                                    />
                                    {fieldErrors.password && <p className="text-destructive text-xs">{fieldErrors.password}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        className={fieldErrors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}
                                    />
                                    {fieldErrors.confirmPassword && <p className="text-destructive text-xs">{fieldErrors.confirmPassword}</p>}
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    required
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <Label htmlFor="terms" className="text-sm font-normal text-muted-foreground">
                                    I agree to the <button type="button" className="text-primary hover:underline font-medium p-0 h-auto" onClick={() => alert('Terms & Conditions feature coming soon')}>Terms & Conditions</button>
                                </Label>
                            </div>

                            <Button type="submit" className="w-full mt-6" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Register Now
                            </Button>

                            <div className="text-center text-sm text-muted-foreground mt-4">
                                Already have an account?{" "}
                                <Link to="/login" className="font-semibold text-primary hover:underline">
                                    Sign In
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Register;
