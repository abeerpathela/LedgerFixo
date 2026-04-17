import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, MessageSquare, BarChart3, PieChart, Settings, LogOut, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const { logout } = useAuth();

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
        { name: 'Invoices', icon: FileText, path: '/invoices' },
        { name: 'Clients', icon: Users, path: '/clients' },
        { name: 'Chat', icon: MessageSquare, path: '/chat' },
        { name: 'Reports', icon: BarChart3, path: '/reports' },
        { name: 'GST Reports', icon: PieChart, path: '/gst' },
        { name: 'Settings', icon: Settings, path: '/settings' },
    ];

    return (
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-16">
            <nav className="flex-1 px-4 py-6 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                                    ? 'bg-blue-50 text-primary font-semibold'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <Icon size={20} className="mr-3" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={logout}
                    className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                    <LogOut size={20} className="mr-3" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
