import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, Send, Eye } from 'lucide-react';
import { invoiceService } from '../services/invoiceService';
import { clientService } from '../services/clientService';
import { useAuth } from '../context/AuthContext';

const InvoiceForm = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [items, setItems] = useState([{ name: '', quantity: 1, rate: 0, taxRate: 18, taxType: 'CGST', amount: 0 }]);
    const [client, setClient] = useState({ name: '', email: '', phone: '', address: '', gstNumber: '' });
    const [invoiceDetails, setInvoiceDetails] = useState({
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const addItem = () => setItems([...items, { name: '', quantity: 1, rate: 0, taxRate: 18, taxType: 'CGST', amount: 0 }]);
    const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

    const updateItem = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        if (field === 'quantity' || field === 'rate') {
            newItems[index].amount = newItems[index].quantity * newItems[index].rate;
        }
        setItems(newItems);
    };

    const subTotal = items.reduce((sum, item) => sum + item.amount, 0);
    const totalTax = items.reduce((sum, item) => sum + (item.amount * item.taxRate / 100), 0);
    const totalAmount = subTotal + totalTax;

    const handleSave = async (status = 'draft') => {
        setLoading(true);
        setError('');

        try {
            const invoiceData = {
                client,
                items,
                issueDate: invoiceDetails.issueDate,
                dueDate: invoiceDetails.dueDate,
                notes: invoiceDetails.notes,
                subtotal: subTotal,
                total: totalAmount,
                status
            };

            await invoiceService.create(invoiceData);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create invoice');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Create New Invoice</h1>
                    <p className="text-gray-500">Draft your professional invoice with automated GST</p>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={() => handleSave('draft')}
                        className="btn-secondary"
                        disabled={loading}
                    >
                        <Save size={18} className="mr-2" /> Save Draft
                    </button>
                    <button
                        onClick={() => handleSave('sent')}
                        className="btn-primary"
                        disabled={loading}
                    >
                        <Send size={18} className="mr-2" /> {loading ? 'Saving...' : 'Send Invoice'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <div className="card">
                        <h2 className="text-lg font-bold mb-6">Client Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Client Name *</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-4 focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="Acme Corporation"
                                    value={client.name}
                                    onChange={(e) => setClient({ ...client, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                                <input
                                    type="email"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-4 focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="billing@acme.com"
                                    value={client.email}
                                    onChange={(e) => setClient({ ...client, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input
                                    type="tel"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-4 focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="+91 99999 99999"
                                    value={client.phone}
                                    onChange={(e) => setClient({ ...client, phone: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-4 focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="29ABCDE1234F1Z5"
                                    value={client.gstNumber}
                                    onChange={(e) => setClient({ ...client, gstNumber: e.target.value })}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <textarea
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-4 focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="Full address"
                                    rows="2"
                                    value={client.address}
                                    onChange={(e) => setClient({ ...client, address: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <h2 className="text-lg font-bold mb-6">Line Items</h2>
                        <div className="space-y-4">
                            {items.map((item, index) => (
                                <div key={index} className="flex gap-4 items-end">
                                    <div className="flex-1">
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Item Description</label>
                                        <input
                                            type="text"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                                            placeholder="Web Design Services"
                                            value={item.name}
                                            onChange={(e) => updateItem(index, 'name', e.target.value)}
                                        />
                                    </div>
                                    <div className="w-20">
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Qty</label>
                                        <input
                                            type="number"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                                            value={item.quantity}
                                            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                                        />
                                    </div>
                                    <div className="w-32">
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Rate (₹)</label>
                                        <input
                                            type="number"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                                            value={item.rate}
                                            onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                                        />
                                    </div>
                                    <div className="w-24">
                                        <label className="block text-xs font-medium text-gray-500 mb-1">GST %</label>
                                        <select
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-2 focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                                            value={item.taxRate}
                                            onChange={(e) => updateItem(index, 'taxRate', parseInt(e.target.value))}
                                        >
                                            <option value="0">0%</option>
                                            <option value="5">5%</option>
                                            <option value="12">12%</option>
                                            <option value="18">18%</option>
                                            <option value="28">28%</option>
                                        </select>
                                    </div>
                                    <div className="w-24 text-right pr-2">
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Amount</label>
                                        <p className="py-2 text-sm font-bold">₹{item.amount.toLocaleString()}</p>
                                    </div>
                                    <button
                                        onClick={() => removeItem(index)}
                                        className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                        disabled={items.length === 1}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={addItem}
                                className="flex items-center text-primary font-semibold text-sm hover:underline mt-4"
                            >
                                <Plus size={16} className="mr-1" /> Add New Row
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="card">
                        <h2 className="text-lg font-bold mb-6">Invoice Info</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
                                <input
                                    type="date"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-4 focus:ring-2 focus:ring-primary/20 outline-none"
                                    value={invoiceDetails.issueDate}
                                    onChange={(e) => setInvoiceDetails({ ...invoiceDetails, issueDate: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                <input
                                    type="date"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-4 focus:ring-2 focus:ring-primary/20 outline-none"
                                    value={invoiceDetails.dueDate}
                                    onChange={(e) => setInvoiceDetails({ ...invoiceDetails, dueDate: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                <textarea
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-4 focus:ring-2 focus:ring-primary/20 outline-none"
                                    rows="3"
                                    placeholder="Payment terms, thank you note..."
                                    value={invoiceDetails.notes}
                                    onChange={(e) => setInvoiceDetails({ ...invoiceDetails, notes: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="card bg-gray-50 border-dashed">
                        <h2 className="text-lg font-bold mb-4">Summary</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>₹{subTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Total Tax (GST)</span>
                                <span>₹{totalTax.toLocaleString()}</span>
                            </div>
                            <div className="pt-3 border-t border-gray-200 flex justify-between text-lg font-bold text-gray-900">
                                <span>Total Amount</span>
                                <span className="text-primary">₹{totalAmount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceForm;
