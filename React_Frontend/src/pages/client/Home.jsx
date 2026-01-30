import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages, ShieldCheck, Tag, Headset } from "lucide-react";

const Home = () => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const getLanguageLabel = () => {
        if (i18n.language?.startsWith('en')) return 'English';
        if (i18n.language?.startsWith('mr')) return 'मराठी';
        if (i18n.language?.startsWith('fr')) return 'Français';
        return 'Language';
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Language Switcher */}
            <div className="container mx-auto mt-4 flex justify-end px-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="rounded-full gap-2">
                            <Languages className="h-4 w-4" />
                            {getLanguageLabel()}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => changeLanguage('en')} className={i18n.language?.startsWith('en') ? 'bg-accent' : ''}>
                            English
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => changeLanguage('mr')} className={i18n.language?.startsWith('mr') ? 'bg-accent' : ''}>
                            मराठी (Marathi)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => changeLanguage('fr')} className={i18n.language?.startsWith('fr') ? 'bg-accent' : ''}>
                            Français (French)
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Hero Section */}
            <header className="relative py-20 lg:py-32 overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="lg:w-1/2 text-center lg:text-left z-10">
                            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                                <span className="text-foreground">{t('home.heroTitle').split(' ')[0]} </span>
                                <span className="text-gradient">{t('home.heroTitle').split(' ').slice(1).join(' ')}</span>
                            </h1>
                            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                {t('home.heroSub')}
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                                <Link to="/booking">
                                    <Button size="lg" className="rounded-full px-8 text-lg h-12">
                                        {t('home.bookNow')}
                                    </Button>
                                </Link>
                                <Link to="/about">
                                    <Button variant="outline" size="lg" className="rounded-full px-8 text-lg h-12">
                                        Learn More
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="lg:w-1/2 relative">
                            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-border/50">
                                <img
                                    src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80"
                                    className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                                    alt="Premium Car"
                                />
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute -top-10 -right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl -z-10"></div>
                            <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">
                            {t('home.whyChoose').split(' ').slice(0, -1).join(' ')} <span className="text-primary">{t('home.whyChoose').split(' ').slice(-1)}</span>
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('home.whyChooseSub')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-card/50 backdrop-blur-sm">
                            <CardContent className="p-8 text-center flex flex-col items-center h-full">
                                <div className="p-4 bg-primary/10 rounded-full mb-6">
                                    <ShieldCheck className="w-10 h-10 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{t('home.safeSecure')}</h3>
                                <p className="text-muted-foreground leading-relaxed">{t('home.safeSecureSub')}</p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-card/50 backdrop-blur-sm">
                            <CardContent className="p-8 text-center flex flex-col items-center h-full">
                                <div className="p-4 bg-primary/10 rounded-full mb-6">
                                    <Tag className="w-10 h-10 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{t('home.bestRates')}</h3>
                                <p className="text-muted-foreground leading-relaxed">{t('home.bestRatesSub')}</p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-card/50 backdrop-blur-sm">
                            <CardContent className="p-8 text-center flex flex-col items-center h-full">
                                <div className="p-4 bg-primary/10 rounded-full mb-6">
                                    <Headset className="w-10 h-10 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{t('home.support')}</h3>
                                <p className="text-muted-foreground leading-relaxed">{t('home.supportSub')}</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Footer will be redundant here if App.jsx includes it, but Home had it inside. App.jsx puts Footer outside Routes, so Home should NOT have Footer usually. 
               Checking Home.jsx original content: it had <footer ...> inside.
               Checking App.jsx original content: it has <Footer /> outside Routes.
               So Home.jsx having a footer was likely a duplicate or specific design choice. 
               The user's original Home.jsx had a footer section at the bottom.
               However, App.jsx ALSO has <Footer />.
               I will remove the internal footer from Home.jsx to avoid duplication, as App.jsx handles it for all pages.
            */}
        </div>
    );
};

export default Home;
