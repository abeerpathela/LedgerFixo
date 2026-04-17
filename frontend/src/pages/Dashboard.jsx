import React, { useState, useEffect } from 'react';
import { IndianRupee, Clock, AlertTriangle, TrendingUp, ArrowRight } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { invoiceService } from '../services/invoiceService';
import { useAuth } from '../context/AuthContext';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const StatCard = ({ title, amount, icon: Icon, color, trend }) => (
    <div className="card hover:border-primary/20 transition-all cursor-default group">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-opacity-100`}>
                <Icon size={24} className={color.replace('bg-', 'text-')} />
            </div>
            {trend && (
                <div className="flex items-center text-emerald-600 text-xs font-semibold bg-emerald-50 px-2 py-1 rounded-full">
                    <TrendingUp size={12} className="mr-1" />
                    {trend}
                </div>
            )}
        </div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 mt-1">₹{amount.toLocaleString()}</p>
    </div>
);

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [recentInvoices, setRecentInvoices] = useState([]);
    const [recentPayments, setRecentPayments] = useState([]);
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const data = await invoiceService.getStats();

            setStats(data.stats);
            setRecentInvoices(data.recentInvoices || []);
            setRecentPayments(data.recentPayments || []);

            // Prepare chart data
            if (data.monthlyData) {
                setChartData({
                    labels: data.monthlyData.map(d => d.month),
                    datasets: [
                        {
                            label: 'Income',
                            data: data.monthlyData.map(d => d.income),
                            borderColor: '#2563eb',
                            backgroundColor: 'rgba(37, 99, 235, 0.1)',
                            fill: true,
                            tension: 0.4,
                        },
                    ],
                });
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
        }
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#1e3a8a',
                padding: 12,
                titleColor: '#fff',
                bodyColor: '#fff',
                displayColors: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: '#f1f5f9',
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-primary font-semibold">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Financial Overview</h1>
                    <p className="text-gray-500 mt-1">Welcome back, {user?.name}! Here's what's happening today.</p>
                </div>
                <div className="flex space-x-3">
                    <button className="btn-secondary">Export Data</button>
                    <button className="btn-primary">Generate Report</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats && [
                    { title: 'Total Revenue', amount: stats.totalRevenue, icon: IndianRupee, color: 'bg-primary' },
                    { title: 'Pending Payments', amount: stats.pendingPayments, icon: Clock, color: 'bg-yellow-500' },
                    { title: 'Overdue Invoices', amount: stats.overdueInvoices, icon: AlertTriangle, color: 'bg-red-500' },
                    { title: 'This Month Earnings', amount: stats.thisMonthEarnings, icon: TrendingUp, color: 'bg-accent' },
                ].map((stat, i) => <StatCard key={i} {...stat} />)}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="card">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold">Income Trend</h2>
                            <select className="bg-gray-50 border border-gray-200 rounded-md text-sm px-2 py-1 outline-none">
                                <option>Last 6 Months</option>
                                <option>Last Year</option>
                            </select>
                        </div>
                        <div className="h-[300px]">
                            {chartData ? (
                                <Line data={chartData} options={chartOptions} />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">
                                    No data available
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold">Recent Invoices</h2>
                            <button className="text-primary text-sm font-semibold flex items-center hover:underline">
                                View All <ArrowRight size={14} className="ml-1" />
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-gray-400 text-xs uppercase font-medium border-b border-gray-100">
                                        <th className="pb-3">Invoice ID</th>
                                        <th className="pb-3">Client</th>
                                        <th className="pb-3">Amount</th>
                                        <th className="pb-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {recentInvoices.length > 0 ? (
                                        recentInvoices.map((invoice) => (
                                            <tr key={invoice._id} className="text-sm group hover:bg-gray-50/50 transition-colors">
                                                <td className="py-4 font-medium text-primary">{invoice.invoiceNumber}</td>
                                                <td className="py-4 text-gray-600">{invoice.client?.name || 'N/A'}</td>
                                                <td className="py-4 font-bold">₹{invoice.total.toLocaleString()}</td>
                                                <td className="py-4">
                                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${invoice.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                                                            invoice.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                                                                'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {invoice.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="py-8 text-center text-gray-400">
                                                No invoices yet. Create your first invoice!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="card bg-primary text-white border-none overflow-hidden relative">
                        <div className="relative z-10">
                            <h2 className="text-lg font-bold mb-2">Upgrade to Pro</h2>
                            <p className="text-blue-100 text-sm mb-6">Get unlimited invoices, GST filing support, and advanced analytics.</p>
                            <button className="bg-white text-primary px-4 py-2 rounded-lg font-bold text-sm w-full hover:bg-blue-50 transition-colors">
                                Try Pro for 7 Days
                            </button>
                        </div>
                        <TrendingUp size={120} className="absolute -bottom-4 -right-4 text-white/5 rotate-12" />
                    </div>

                    <div className="card">
                        <h2 className="text-lg font-bold mb-4">Quick Links</h2>
                        <div className="space-y-3">
                            {['Add New Client', 'Create Invoice', 'GST Summary', 'Chat with Clients'].map((link) => (
                                <button key={link} className="w-full text-left p-3 rounded-lg border border-gray-50 hover:border-primary/20 hover:bg-gray-50 transition-all text-sm font-medium flex justify-between items-center group">
                                    {link}
                                    <ArrowRight size={14} className="text-gray-300 group-hover:text-primary transition-colors" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
