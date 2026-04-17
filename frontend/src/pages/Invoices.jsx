import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Download, Eye, Edit, Trash2 } from 'lucide-react';
import { invoiceService } from '../services/invoiceService';

const Invoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchInvoices();
    }, [filter]);

    const fetchInvoices = async () => {
        try {
            const filters = filter !== 'all' ? { status: filter } : {};
            const data = await invoiceService.getAll(filters);
            setInvoices(data);
        } catch (error) {
            console.error('Error fetching invoices:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this invoice?')) {
            try {
                await invoiceService.delete(id);
                fetchInvoices();
            } catch (error) {
                alert('Failed to delete invoice');
            }
        }
    };

    const filteredInvoices = invoices.filter(inv =>
        inv.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'paid': return 'bg-emerald-100 text-emerald-700';
            case 'sent': return 'bg-blue-100 text-blue-700';
            case 'viewed': return 'bg-purple-100 text-purple-700';
            case 'overdue': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-96">Loading invoices...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
                    <p className="text-gray-500">Manage all your invoices in one place</p>
                </div>
                <Link to="/invoices/new" className="btn-primary">
                    <Plus size={18} className="mr-2" /> Create Invoice
                </Link>
            </div>

            <div className="card">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by client name or invoice number..."
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-primary/20 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        {['all', 'draft', 'sent', 'paid', 'overdue'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === status
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-xs uppercase font-medium text-gray-400 border-b border-gray-100">
                                <th className="pb-3">Invoice #</th>
                                <th className="pb-3">Client</th>
                                <th className="pb-3">Issue Date</th>
                                <th className="pb-3">Due Date</th>
                                <th className="pb-3">Amount</th>
                                <th className="pb-3">Status</th>
                                <th className="pb-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredInvoices.length > 0 ? (
                                filteredInvoices.map((invoice) => (
                                    <tr key={invoice._id} className="text-sm hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 font-medium text-primary">{invoice.invoiceNumber}</td>
                                        <td className="py-4 text-gray-600">{invoice.client?.name || 'N/A'}</td>
                                        <td className="py-4 text-gray-600">
                                            {new Date(invoice.issueDate).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 text-gray-600">
                                            {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="py-4 font-bold">₹{invoice.total.toLocaleString()}</td>
                                        <td className="py-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(invoice.status)}`}>
                                                {invoice.status}
                                            </span>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex gap-2">
                                                <Link
                                                    to={`/invoices/${invoice._id}`}
                                                    className="p-2 text-gray-400 hover:text-primary transition-colors"
                                                    title="View"
                                                >
                                                    <Eye size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(invoice._id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="py-12 text-center text-gray-400">
                                        No invoices found. Create your first invoice!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Invoices;
