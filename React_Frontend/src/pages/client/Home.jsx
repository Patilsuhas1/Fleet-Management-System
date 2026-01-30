import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages, ShieldCheck, Tag, Headset, ArrowRight, Star, Users, Car, MapPin } from "lucide-react";

const Home = () => {
    const { t, i18n } = useTranslation();
    const { scrollYProgress } = useScroll();
    const carX = useTransform(scrollYProgress, [0, 0.5], [-200, 1000]);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const getLanguageLabel = () => {
        if (i18n.language?.startsWith('en')) return 'English';
        if (i18n.language?.startsWith('mr')) return 'मराठी';
        if (i18n.language?.startsWith('fr')) return 'Français';
        return 'Language';
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    return (
        <div className="min-h-screen bg-background selection:bg-primary/30 overflow-x-hidden">
            {/* Language Switcher */}
            <div className="container mx-auto pt-6 flex justify-end px-4 relative z-50">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="rounded-full gap-2 backdrop-blur-md bg-background/50 border-primary/20 hover:border-primary/50 transition-all duration-300">
                            <Languages className="h-4 w-4" />
                            {getLanguageLabel()}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="backdrop-blur-xl bg-background/80 border-primary/10">
                        <DropdownMenuItem onClick={() => changeLanguage('en')} className={`cursor-pointer ${i18n.language?.startsWith('en') ? 'bg-primary/10 text-primary font-medium' : ''}`}>
                            English
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => changeLanguage('mr')} className={`cursor-pointer ${i18n.language?.startsWith('mr') ? 'bg-primary/10 text-primary font-medium' : ''}`}>
                            मराठी (Marathi)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => changeLanguage('fr')} className={`cursor-pointer ${i18n.language?.startsWith('fr') ? 'bg-primary/10 text-primary font-medium' : ''}`}>
                            Français (French)
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Hero Section */}
            <header className="relative pt-12 pb-24 lg:pt-20 lg:pb-40 overflow-hidden">
                {/* Background Car Animation Container */}
                <div className="absolute bottom-0 left-0 w-full h-24 overflow-hidden pointer-events-none opacity-20 hidden lg:block">
                    <motion.div
                        style={{ x: carX }}
                        className="flex items-center gap-2 text-primary"
                    >
                        <Car size={80} strokeWidth={1} />
                        <div className="h-[2px] w-screen bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                    </motion.div>
                </div>

                <div className="container mx-auto px-4 relative">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                            className="lg:w-1/2 text-center lg:text-left z-10"
                        >
                            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/20">
                                <Star size={14} className="fill-primary" />
                                <span>Premium Fleet Management</span>
                            </motion.div>

                            <motion.h1
                                variants={itemVariants}
                                className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]"
                            >
                                <span className="text-foreground block">{t('home.heroTitle').split(' ')[0]} </span>
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-400 to-indigo-600 animate-gradient">
                                    {t('home.heroTitle').split(' ').slice(1).join(' ')}
                                </span>
                            </motion.h1>

                            <motion.p
                                variants={itemVariants}
                                className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light"
                            >
                                {t('home.heroSub')}
                            </motion.p>

                            <motion.div
                                variants={itemVariants}
                                className="flex flex-wrap gap-5 justify-center lg:justify-start"
                            >
                                <Link to="/booking">
                                    <Button size="lg" className="rounded-full px-10 text-lg h-14 bg-primary hover:bg-primary/90 shadow-[0_8px_30px_rgb(37,99,235,0.4)] group transition-all duration-300">
                                        {t('home.bookNow')}
                                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <Link to="/about">
                                    <Button variant="outline" size="lg" className="rounded-full px-10 text-lg h-14 border-primary/20 hover:bg-primary/5 backdrop-blur-sm">
                                        Learn More
                                    </Button>
                                </Link>
                            </motion.div>

                            {/* Trust Badges */}
                            <motion.div
                                variants={itemVariants}
                                className="mt-12 flex flex-wrap gap-8 justify-center lg:justify-start grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                            >
                                <div className="flex items-center gap-2">
                                    <Users size={20} />
                                    <span className="font-bold">50k+ Users</span>
                                </div>
                                <div className="flex items-center gap-2 text-primary">
                                    <MapPin size={20} />
                                    <span className="font-bold">12 Hubs</span>
                                </div>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, x: 50 }}
                            animate={{ scale: 1, opacity: 1, x: 0 }}
                            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                            className="lg:w-1/2 relative group"
                        >
                            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)] ring-1 ring-primary/20 group-hover:ring-primary/40 transition-all duration-500">
                                <motion.img
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.7 }}
                                    src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80"
                                    className="w-full h-full object-cover"
                                    alt="Premium Car"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                            </div>

                            {/* Animated Background Blobs */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 90, 0],
                                    opacity: [0.2, 0.4, 0.2]
                                }}
                                transition={{ duration: 8, repeat: Infinity }}
                                className="absolute -top-10 -right-10 w-80 h-80 bg-primary/30 rounded-full blur-[80px] -z-10"
                            />
                            <motion.div
                                animate={{
                                    scale: [1, 1.3, 1],
                                    rotate: [0, -90, 0],
                                    opacity: [0.2, 0.3, 0.2]
                                }}
                                transition={{ duration: 10, repeat: Infinity }}
                                className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/30 rounded-full blur-[80px] -z-10"
                            />
                        </motion.div>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section className="py-24 relative bg-muted/20">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                            {t('home.whyChoose').split(' ').slice(0, -1).join(' ')} <span className="text-primary relative inline-block">
                                {t('home.whyChoose').split(' ').slice(-1)}
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: '100%' }}
                                    className="absolute bottom-1 left-0 h-[8px] bg-primary/20 -z-10"
                                />
                            </span>
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">{t('home.whyChooseSub')}</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            { icon: ShieldCheck, title: t('home.safeSecure'), sub: t('home.safeSecureSub'), color: 'bg-emerald-500/10 text-emerald-600' },
                            { icon: Tag, title: t('home.bestRates'), sub: t('home.bestRatesSub'), color: 'bg-blue-500/10 text-blue-600' },
                            { icon: Headset, title: t('home.support'), sub: t('home.supportSub'), color: 'bg-indigo-500/10 text-indigo-600' }
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                            >
                                <Card className="border-none shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(37,99,235,0.08)] transition-all duration-500 bg-card/60 backdrop-blur-md group hover:-translate-y-2 relative overflow-hidden h-full">
                                    <div className={`absolute top-0 right-0 w-24 h-24 ${feature.color.split(' ')[0]} rounded-bl-full opacity-50 group-hover:scale-110 transition-transform duration-500`} />
                                    <CardContent className="p-10 text-center flex flex-col items-center relative z-10">
                                        <div className={`p-5 ${feature.color} rounded-2xl mb-8 group-hover:scale-110 transition-transform duration-500`}>
                                            <feature.icon className="w-10 h-10" />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                                        <p className="text-muted-foreground leading-relaxed font-light">{feature.sub}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 container mx-auto px-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { label: 'Vehicles', value: '1,200+' },
                        { label: 'Cities', value: '24' },
                        { label: 'Happy Clients', value: '50k+' },
                        { label: 'Support', value: '24/7' }
                    ].map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="text-center group p-6 rounded-3xl hover:bg-muted/50 transition-colors"
                        >
                            <div className="text-4xl lg:text-5xl font-extrabold text-primary mb-2 group-hover:scale-110 transition-transform">{stat.value}</div>
                            <div className="text-muted-foreground font-medium uppercase tracking-wider text-sm">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
