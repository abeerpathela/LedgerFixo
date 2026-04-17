import React, { useState, useEffect } from 'react';
import { Download, Calendar } from 'lucide-react';
import { reportService } from '../services/reportService';

const GSTReports = () => {
    const [gstData, setGstData] = useState({ gstInvoices: [], summary: {} });
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGSTData();
    }, [dateRange]);

    const fetchGSTData = async () => {
        try {
            const data = await reportService.getGSTSummary(dateRange);
            setGstData(data);
        } catch (error) {
            console.error('Error fetching GST data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-96">Loading GST reports...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">GST Reports</h1>
                    <p className="text-gray-500">CGST, SGST, and IGST breakdown</p>
                </div>
                <button className="btn-primary">
                    <Download size={18} className="mr-2" /> Download GSTR-1
                </button>
            </div>

            {/* Date Range Filter */}
            <div className="card">
                <div className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                            type="date"
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-4 outline-none"
                            value={dateRange.startDate}
                            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input
                            type="date"
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-4 outline-none"
                            value={dateRange.endDate}
                            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                        />
                    </div>
                    <button
                        onClick={fetchGSTData}
                        className="btn-primary"
                    >
                        Apply Filter
                    </button>
                </div>
            </div>

            {/* GST Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="card bg-blue-50 border-blue-200">
                    <div className="text-sm text-blue-600 font-medium mb-1">Total CGST</div>
                    <div className="text-2xl font-bold text-blue-700">
                        ₹{gstData.summary.totalCGST?.toLocaleString() || 0}
                    </div>
                </div>
                <div className="card bg-emerald-50 border-emerald-200">
                    <div className="text-sm text-emerald-600 font-medium mb-1">Total SGST</div>
                    <div className="text-2xl font-bold text-emerald-700">
                        ₹{gstData.summary.totalSGST?.toLocaleString() || 0}
                    </div>
                </div>
                <div className="card bg-purple-50 border-purple-200">
                    <div className="text-sm text-purple-600 font-medium mb-1">Total IGST</div>
                    <div className="text-2xl font-bold text-purple-700">
                        ₹{gstData.summary.totalIGST?.toLocaleString() || 0}
                    </div>
                </div>
                <div className="card bg-primary/10 border-primary/20">
                    <div className="text-sm text-primary font-medium mb-1">Total GST</div>
                    <div className="text-2xl font-bold text-primary">
                        ₹{gstData.summary.totalGST?.toLocaleString() || 0}
                    </div>
                </div>
            </div>

            {/* GST Invoice Details */}
            <div className="card">
                <h2 className="text-lg font-bold mb-6">Invoice-wise GST Breakdown</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-xs uppercase font-medium text-gray-400 border-b border-gray-100">
                                <th className="pb-3">Invoice No</th>
                                <th className="pb-3">Date</th>
                                <th className="pb-3">Client</th>
                                <th className="pb-3 text-right">Taxable Amount</th>
                                <th className="pb-3 text-right">CGST</th>
                                <th className="pb-3 text-right">SGST</th>
                                <th className="pb-3 text-right">IGST</th>
                                <th className="pb-3 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {gstData.gstInvoices.length > 0 ? (
                                gstData.gstInvoices.map((invoice, index) => (
                                    <tr key={index} className="text-sm hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 font-medium text-primary">{invoice.invoiceNumber}</td>
                                        <td className="py-4 text-gray-600">
                                            {new Date(invoice.date).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 text-gray-600">{invoice.client}</td>
                                        <td className="py-4 text-right font-semibold">
                                            ₹{invoice.taxableAmount.toLocaleString()}
                                        </td>
                                        <td className="py-4 text-right text-blue-600">
                                            ₹{invoice.cgst.toLocaleString()}
                                        </td>
                                        <td className="py-4 text-right text-emerald-600">
                                            ₹{invoice.sgst.toLocaleString()}
                                        </td>
                                        <td className="py-4 text-right text-purple-600">
                                            ₹{invoice.igst.toLocaleString()}
                                        </td>
                                        <td className="py-4 text-right font-bold">
                                            ₹{invoice.total.toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="py-12 text-center text-gray-400">
                                        No GST data for this period
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

export default GSTReports;
