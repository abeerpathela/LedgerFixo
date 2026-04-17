import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2 } from 'lucide-react';

const Register = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', phone: '', businessName: '', gstNumber: '', location: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await register(formData);

        if (result.success) {
            setStep(2);
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (step === 2) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="max-w-md w-full card p-10 text-center animate-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={40} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Account Created!</h1>
                    <p className="text-gray-500 mb-8">Your LedgerFixo account has been created successfully. You can now start managing your invoices.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full btn-primary py-3"
                    >
                        Continue to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-xl text-white text-2xl font-bold mb-4">L</div>
                    <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
                    <p className="text-gray-500 mt-1">Start your 30-day free trial</p>
                </div>

                <div className="card p-8">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Work Email</label>
                            <input
                                type="email"
                                name="email"
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="john@company.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="+91 99999 99999"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div className="pt-2">
                            <button
                                type="submit"
                                className="w-full btn-primary py-3"
                                disabled={loading}
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </div>
                    </form>
                </div>
                <p className="text-center mt-6 text-sm text-gray-600">
                    Already have an account? {' '}
                    <Link to="/login" className="font-bold text-primary hover:underline">Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
