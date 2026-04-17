import React from 'react';
import { Bell, Search, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user } = useAuth();

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-10">
            <div className="flex items-center">
                <div className="text-2xl font-bold text-primary flex items-center">
                    <div className="w-8 h-8 bg-primary rounded-lg mr-2 flex items-center justify-center text-white text-lg">L</div>
                    LedgerFixo
                </div>
            </div>

            <div className="flex-1 max-w-xl mx-8">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search Invoices or Users..."
                        className="w-full bg-gray-100 border-none rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none text-sm"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-6">
                <div className="relative cursor-pointer">
                    <Bell size={20} className="text-gray-600 hover:text-primary transition-colors" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full text-[10px] text-white flex items-center justify-center font-bold">3</span>
                </div>

                <div className="flex items-center space-x-3 cursor-pointer group">
                    <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold overflow-hidden border border-primary/20">
                        {user?.name?.[0]?.toUpperCase() || <User size={18} />}
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-sm font-semibold text-gray-800 leading-none">{user?.name || 'Abeer Pathela'}</p>
                        <p className="text-xs text-gray-500 mt-1">Free Plan</p>
                    </div>
                    <ChevronDown size={14} className="text-gray-400 group-hover:text-primary" />
                </div>
            </div>
        </header>
    );
};

export default Navbar;
