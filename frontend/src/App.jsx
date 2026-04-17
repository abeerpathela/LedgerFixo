import React from 'react';
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import InvoiceForm from './pages/InvoiceForm';
import InvoiceView from './pages/InvoiceView';
import Invoices from './pages/Invoices';
import Chat from './pages/Chat';
import Reports from './pages/Reports';
import GSTReports from './pages/GSTReports';
import { useAuth } from './context/AuthContext';
import { Plus } from 'lucide-react';

const App = () => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen font-semibold text-primary">
                Loading LedgerFixo...
            </div>
        );
    }

    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    return (
        <div className="min-h-screen bg-background">
            {!isAuthPage && user && (
                <>
                    <Navbar />
                    <Sidebar />
                    <div className="pt-16 pl-64 transition-all duration-300">
                        <main className="p-8">
                            <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/invoices" element={<Invoices />} />
                                <Route path="/invoices/new" element={<InvoiceForm />} />
                                <Route path="/invoices/:id" element={<InvoiceView />} />
                                <Route path="/chat" element={<Chat />} />
                                <Route path="/reports" element={<Reports />} />
                                <Route path="/gst" element={<GSTReports />} />
                                <Route path="*" element={<Navigate to="/" />} />
                            </Routes>
                        </main>
                    </div>

                    {/* Floating Action Button */}
                    <Link
                        to="/invoices/new"
                        className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark transition-all flex items-center justify-center hover:scale-110 active:scale-95 z-50"
                        title="Create New Invoice"
                    >
                        <Plus size={28} />
                    </Link>
                </>
            )}

            {(isAuthPage || !user) && (
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            )}
        </div>
    );
};

export default App;
