import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, Send, Edit, ArrowLeft, CheckCircle } from 'lucide-react';
import { invoiceService } from '../services/invoiceService';

const InvoiceView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInvoice();
    }, [id]);

    const fetchInvoice = async () => {
        try {
            const data = await invoiceService.getById(id);
            setInvoice(data);
        } catch (error) {
            console.error('Error fetching invoice:', error);
            alert('Invoice not found');
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (status) => {
        try {
            await invoiceService.updateStatus(id, status);
            fetchInvoice();
        } catch (error) {
            alert('Failed to update status');
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-96">Loading invoice...</div>;
    }

    if (!invoice) {
        return <div className="flex items-center justify-center h-96">Invoice not found</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-900">
                    <ArrowLeft size={18} className="mr-2" /> Back
                </button>
                <div className="flex gap-3">
                    <button className="btn-secondary">
                        <Download size={18} className="mr-2" /> Download PDF
                    </button>
                    {invoice.status !== 'paid' && (
                        <button
                            onClick={() => updateStatus('paid')}
                            className="btn-primary"
                        >
                            <CheckCircle size={18} className="mr-2" /> Mark as Paid
                        </button>
                    )}
                </div>
            </div>

            <div className="card p-12">
                {/* Header */}
                <div className="flex justify-between items-start mb-12">
                    <div>
                        <h1 className="text-4xl font-bold text-primary mb-2">INVOICE</h1>
                        <p className="text-gray-600">#{invoice.invoiceNumber}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-500 mb-1">Status</div>
                        <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase ${invoice.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                                invoice.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                                    'bg-yellow-100 text-yellow-700'
                            }`}>
                            {invoice.status}
                        </span>
                    </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-8 mb-12">
                    <div>
                        <div className="text-sm text-gray-500 mb-1">Issue Date</div>
                        <div className="font-semibold">{new Date(invoice.issueDate).toLocaleDateString()}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500 mb-1">Due Date</div>
                        <div className="font-semibold">
                            {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '-'}
                        </div>
                    </div>
                </div>

                {/* Client Info */}
                <div className="mb-12">
                    <div className="text-sm text-gray-500 mb-2">Bill To:</div>
                    <div className="font-bold text-lg">{invoice.client.name}</div>
                    <div className="text-gray-600">{invoice.client.email}</div>
                    {invoice.client.phone && <div className="text-gray-600">{invoice.client.phone}</div>}
                    {invoice.client.address && <div className="text-gray-600">{invoice.client.address}</div>}
                    {invoice.client.gstNumber && (
                        <div className="text-gray-600 mt-1">GST: {invoice.client.gstNumber}</div>
                    )}
                </div>

                {/* Items Table */}
                <table className="w-full mb-12">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                            <th className="text-left py-3 text-sm font-semibold text-gray-600">Description</th>
                            <th className="text-right py-3 text-sm font-semibold text-gray-600">Qty</th>
                            <th className="text-right py-3 text-sm font-semibold text-gray-600">Rate</th>
                            <th className="text-right py-3 text-sm font-semibold text-gray-600">Tax</th>
                            <th className="text-right py-3 text-sm font-semibold text-gray-600">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map((item, index) => (
                            <tr key={index} className="border-b border-gray-100">
                                <td className="py-4">{item.name}</td>
                                <td className="py-4 text-right">{item.quantity}</td>
                                <td className="py-4 text-right">₹{item.rate.toLocaleString()}</td>
                                <td className="py-4 text-right">{item.taxRate}%</td>
                                <td className="py-4 text-right font-semibold">
                                    ₹{(item.quantity * item.rate).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals */}
                <div className="flex justify-end">
                    <div className="w-80 space-y-3">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>₹{invoice.subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Tax</span>
                            <span>₹{(invoice.total - invoice.subtotal).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold pt-3 border-t-2 border-gray-200">
                            <span>Total</span>
                            <span className="text-primary">₹{invoice.total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                {invoice.notes && (
                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <div className="text-sm text-gray-500 mb-2">Notes</div>
                        <div className="text-gray-700">{invoice.notes}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InvoiceView;
