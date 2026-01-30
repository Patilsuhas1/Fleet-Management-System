import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthService from '../../services/authService';

const Home = () => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="home-container">
            {/* Language Switcher */}
            <div className="container mt-3 text-end">
                <div className="dropdown d-inline-block">
                    <button
                        className="btn btn-premium btn-sm dropdown-toggle rounded-pill px-3"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <i className="bi bi-translate me-2"></i>
                        {i18n.language?.startsWith('en') ? 'English' : i18n.language?.startsWith('mr') ? 'मराठी' : i18n.language?.startsWith('fr') ? 'Français' : 'Language'}
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-4">
                        <li>
                            <button className={`dropdown - item py - 2 ${i18n.language?.startsWith('en') ? 'active bg-primary' : ''} `} onClick={() => changeLanguage('en')}>
                                English
                            </button>
                        </li>
                        <li>
                            <button className={`dropdown - item py - 2 ${i18n.language?.startsWith('mr') ? 'active bg-primary' : ''} `} onClick={() => changeLanguage('mr')}>
                                मराठी (Marathi)
                            </button>
                        </li>
                        <li>
                            <button className={`dropdown - item py - 2 ${i18n.language?.startsWith('fr') ? 'active bg-primary' : ''} `} onClick={() => changeLanguage('fr')}>
                                Français (French)
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Hero Section */}
            <header className="hero-section py-5 position-relative">
                <div className="container py-5">
                    <div className="row align-items-center">
                        <div className="col-lg-7 text-start">
                            <h1 className="display-3 fw-bold mb-4">
                                <span className="text-adaptive">{t('home.heroTitle').split(' ')[0]} </span>
                                <span className="text-gradient">{t('home.heroTitle').split(' ').slice(1).join(' ')}</span>
                            </h1>
                            <p className="lead fs-4 text-muted mb-5 pe-lg-5">
                                {t('home.heroSub')}
                            </p>
                            <div className="d-flex gap-4 mt-2">
                                <Link to="/booking" className="btn btn-premium btn-lg">
                                    {t('home.bookNow')}
                                </Link>
                                {AuthService.getCurrentUser() && (
                                    <Link to="/manage-booking" className="btn btn-outline-premium btn-lg">
                                        {t('home.manageBooking')}
                                    </Link>
                                )}
                            </div>
                        </div>
                        <div className="col-lg-5 d-none d-lg-block">
                            <div className="premium-card p-3">
                                <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80"
                                    className="img-fluid rounded-4" alt="Premium Car" />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section className="container py-5 my-5">
                <div className="text-center mb-5">
                    <h2 className="display-5 fw-bold mb-3">{t('home.whyChoose').split(' ').slice(0, -1).join(' ')} <span className="text-primary">{t('home.whyChoose').split(' ').slice(-1)}</span></h2>
                    <p className="text-muted fs-5">{t('home.whyChooseSub')}</p>
                </div>
                <div className="row g-4">
                    <div className="col-md-4">
                        <div className="premium-card h-100 p-5 text-center">
                            <div className="bg-primary bg-opacity-10 p-4 rounded-circle d-inline-block mb-4">
                                <i className="bi bi-shield-check fs-1 text-primary"></i>
                            </div>
                            <h3 className="h4 mb-3">{t('home.safeSecure')}</h3>
                            <p className="text-muted mb-0">{t('home.safeSecureSub')}</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="premium-card h-100 p-5 text-center">
                            <div className="bg-primary bg-opacity-10 p-4 rounded-circle d-inline-block mb-4">
                                <i className="bi bi-tag fs-1 text-primary"></i>
                            </div>
                            <h3 className="h4 mb-3">{t('home.bestRates')}</h3>
                            <p className="text-muted mb-0">{t('home.bestRatesSub')}</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="premium-card h-100 p-5 text-center">
                            <div className="bg-primary bg-opacity-10 p-4 rounded-circle d-inline-block mb-4">
                                <i className="bi bi-clock-history fs-1 text-primary"></i>
                            </div>
                            <h3 className="h4 mb-3">{t('home.support')}</h3>
                            <p className="text-muted mb-0">{t('home.supportSub')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-5 mt-5 bg-adaptive border-top">
                <div className="container text-center">
                    <p className="text-muted mb-0">{t('home.footer')}</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
