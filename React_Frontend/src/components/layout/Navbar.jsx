import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../../services/authService';
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Menu, Moon, Sun, Shield, LogOut, User as UserIcon } from "lucide-react";

const Navbar = ({ theme, toggleTheme }) => {
    const navigate = useNavigate();
    const user = AuthService.getCurrentUser();
    const role = user?.role;
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        AuthService.logout();
        navigate('/login');
    };

    const NavItems = () => (
        <>
            <Link to="/" className="text-sm font-medium transition-colors hover:text-primary" onClick={() => setIsOpen(false)}>Home</Link>

            {(!user || role === 'CUSTOMER') && (
                <Link to="/booking" className="text-sm font-medium transition-colors hover:text-primary" onClick={() => setIsOpen(false)}>Book a Car</Link>
            )}

            {role === 'CUSTOMER' && (
                <Link to="/my-bookings" className="text-sm font-medium transition-colors hover:text-primary" onClick={() => setIsOpen(false)}>My Bookings</Link>
            )}

            {role === 'STAFF' && (
                <Link to="/staff/dashboard" className="text-sm font-medium transition-colors hover:text-primary" onClick={() => setIsOpen(false)}>Dashboard</Link>
            )}

            {role === 'ADMIN' && (
                <Link to="/admin/dashboard" className="text-sm font-medium transition-colors hover:text-primary" onClick={() => setIsOpen(false)}>Admin Panel</Link>
            )}

            <Link to="/about" className="text-sm font-medium transition-colors hover:text-primary" onClick={() => setIsOpen(false)}>About Us</Link>
            <Link to="/customer-care" className="text-sm font-medium transition-colors hover:text-primary" onClick={() => setIsOpen(false)}>Support</Link>
        </>
    );

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <Link className="flex items-center gap-2 font-bold text-xl group" to="/">
                    <div className="relative">
                        <Shield className="h-6 w-6 text-primary filled-current relative z-10 transition-transform duration-300 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-primary/40 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <span className="bg-gradient-to-r from-primary via-blue-500 to-indigo-600 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">IndiaDrive</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    <NavItems />
                </nav>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        title={`Switch to ${theme === 'dark-theme' ? 'Light' : 'Dark'} Mode`}
                    >
                        {theme === 'dark-theme' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>

                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="gap-2 px-2 sm:px-4">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <UserIcon className="h-4 w-4 text-primary" />
                                    </div>
                                    <span className="hidden sm:inline-block font-medium">{user.username}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => navigate(role === 'ADMIN' ? '/admin/dashboard' : role === 'STAFF' ? '/staff/dashboard' : '/my-bookings')}>
                                    Dashboard
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleLogout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="hidden md:flex items-center gap-2">
                            <Link to="/login">
                                <Button variant="ghost">Login</Button>
                            </Link>
                            <Link to="/register">
                                <Button>Join Now</Button>
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu */}
                    <div className="md:hidden">
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right">
                                <div className="flex flex-col gap-4 mt-8">
                                    <NavItems />
                                    {!user && (
                                        <div className="flex flex-col gap-2 mt-4">
                                            <Link to="/login" onClick={() => setIsOpen(false)}>
                                                <Button variant="outline" className="w-full">Login</Button>
                                            </Link>
                                            <Link to="/register" onClick={() => setIsOpen(false)}>
                                                <Button className="w-full">Join Now</Button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
