import React from 'react';
import { Link } from 'react-router-dom';
import {
    FileText,
    TrendingUp,
    Shield,
    Zap,
    Users,
    BarChart3,
    CheckCircle2,
    ArrowRight,
    IndianRupee,
    Clock,
    Download
} from 'lucide-react';

const Landing = () => {
    const features = [
        {
            icon: FileText,
            title: 'Professional Invoicing',
            description: 'Create beautiful, GST-compliant invoices in seconds with automated calculations'
        },
        {
            icon: TrendingUp,
            title: 'Real-time Analytics',
            description: 'Track revenue, pending payments, and business growth with interactive charts'
        },
        {
            icon: Shield,
            title: 'GST Compliance',
            description: 'Automatic CGST, SGST, and IGST calculations with ready-to-file reports'
        },
        {
            icon: Zap,
            title: 'Lightning Fast',
            description: 'Built with modern tech stack for blazing fast performance'
        },
        {
            icon: Users,
            title: 'Client Management',
            description: 'Organize and manage all your clients in one centralized location'
        },
        {
            icon: BarChart3,
            title: 'Financial Reports',
            description: 'Complete ledger with running balances and profit/loss statements'
        }
    ];

    const benefits = [
        'Unlimited invoices and clients',
        'Automated GST calculations',
        'Professional PDF invoices',
        'Real-time dashboard analytics',
        'Secure cloud storage',
        'Mobile responsive design'
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-primary rounded-xl text-white text-xl font-bold flex items-center justify-center shadow-lg shadow-primary/20">
                            L
                        </div>
                        <span className="text-2xl font-bold text-gray-900">LedgerFixo</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link to="/login" className="btn-secondary">
                            Sign In
                        </Link>
                        <Link to="/register" className="btn-primary">
                            Get Started Free
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-6 py-20 text-center">
                <div className="inline-flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
                    <Zap size={16} className="mr-2" />
                    India's Modern Invoicing Platform
                </div>

                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                    Simplify Your Business
                    <br />
                    <span className="text-primary">Finances & Invoicing</span>
                </h1>

                <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                    Create professional GST-compliant invoices, track payments, and manage your business finances—all in one beautiful platform.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                    <Link to="/register" className="btn-primary text-lg px-8 py-4">
                        Start Free Trial
                        <ArrowRight size={20} className="ml-2" />
                    </Link>
                    <Link to="/login" className="btn-secondary text-lg px-8 py-4">
                        Sign In
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16">
                    <div>
                        <div className="text-3xl font-bold text-primary">100%</div>
                        <div className="text-gray-600 text-sm">GST Compliant</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-primary">5 Min</div>
                        <div className="text-gray-600 text-sm">Setup Time</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-primary">∞</div>
                        <div className="text-gray-600 text-sm">Invoices</div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Everything You Need to Run Your Business
                    </h2>
                    <p className="text-xl text-gray-600">
                        Powerful features designed for Indian businesses
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="card hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                <feature.icon className="text-primary" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Benefits Section */}
            <section className="bg-primary/5 py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-6">
                                Why Choose LedgerFixo?
                            </h2>
                            <p className="text-lg text-gray-600 mb-8">
                                Built specifically for Indian businesses with GST compliance, automated calculations, and beautiful reporting.
                            </p>
                            <div className="space-y-4">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-center space-x-3">
                                        <CheckCircle2 className="text-accent flex-shrink-0" size={24} />
                                        <span className="text-gray-700 text-lg">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                            <Link to="/register" className="btn-primary mt-8 inline-flex items-center">
                                Get Started Now
                                <ArrowRight size={18} className="ml-2" />
                            </Link>
                        </div>
                        <div className="card p-8 bg-white">
                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <IndianRupee className="text-blue-600" size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1">Smart Invoicing</h4>
                                        <p className="text-gray-600 text-sm">Auto-calculate taxes, discounts, and totals</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Clock className="text-emerald-600" size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1">Save Time</h4>
                                        <p className="text-gray-600 text-sm">Create invoices in under 2 minutes</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Download className="text-purple-600" size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1">Export Anywhere</h4>
                                        <p className="text-gray-600 text-sm">Download PDFs, Excel reports instantly</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="card bg-gradient-to-r from-primary to-blue-600 text-white p-12 text-center">
                    <h2 className="text-4xl font-bold mb-4">
                        Ready to Simplify Your Invoicing?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Join thousands of businesses managing their finances with LedgerFixo. Start your free trial today—no credit card required.
                    </p>
                    <Link
                        to="/register"
                        className="inline-flex items-center bg-white text-primary px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
                    >
                        Get Started Free
                        <ArrowRight size={20} className="ml-2" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <div className="w-8 h-8 bg-primary rounded-lg text-white text-lg font-bold flex items-center justify-center">
                            L
                        </div>
                        <span className="text-xl font-bold text-white">LedgerFixo</span>
                    </div>
                    <p className="text-sm">
                        © 2024 LedgerFixo. All rights reserved. Made with ❤️ for Indian businesses.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
