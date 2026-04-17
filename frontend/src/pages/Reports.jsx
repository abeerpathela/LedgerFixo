import React, { useState, useEffect } from 'react';
import { Download, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { reportService } from '../services/reportService';

const Reports = () => {
    const [ledger, setLedger] = useState({ ledgerEntries: [], summary: {} });
    const [period, setPeriod] = useState('thisMonth');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLedger();
    }, [period]);

    const fetchLedger = async () => {
        try {
            const data = await reportService.getLedger({ period });
            setLedger(data);
        } catch (error) {
            console.error('Error fetching ledger:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-96">Loading reports...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
                    <p className="text-gray-500">Complete ledger and financial summary</p>
                </div>
                <div className="flex gap-3">
                    <select
                        className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 outline-none"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                    >
                        <option value="thisMonth">This Month</option>
                        <option value="thisYear">This Year</option>
                        <option value="financialYear">Financial Year</option>
                    </select>
                    <button className="btn-primary">
                        <Download size={18} className="mr-2" /> Export to Excel
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="card">
                    <div className="text-sm text-gray-500 mb-1">Total Credit</div>
                    <div className="text-2xl font-bold text-emerald-600">
                        ₹{ledger.summary.totalCredit?.toLocaleString() || 0}
                    </div>
                    <div className="flex items-center text-xs text-emerald-600 mt-2">
                        <TrendingUp size={14} className="mr-1" /> Income
                    </div>
                </div>
                <div className="card">
                    <div className="text-sm text-gray-500 mb-1">Total Debit</div>
                    <div className="text-2xl font-bold text-red-600">
                        ₹{ledger.summary.totalDebit?.toLocaleString() || 0}
                    </div>
                    <div className="flex items-center text-xs text-red-600 mt-2">
                        <TrendingDown size={14} className="mr-1" /> Expenses
                    </div>
                </div>
                <div className="card">
                    <div className="text-sm text-gray-500 mb-1">Net Profit</div>
                    <div className="text-2xl font-bold text-primary">
                        ₹{ledger.summary.netProfit?.toLocaleString() || 0}
                    </div>
                </div>
                <div className="card">
                    <div className="text-sm text-gray-500 mb-1">Closing Balance</div>
                    <div className="text-2xl font-bold text-gray-900">
                        ₹{ledger.summary.closingBalance?.toLocaleString() || 0}
                    </div>
                </div>
            </div>

            {/* Ledger Table */}
            <div className="card">
                <h2 className="text-lg font-bold mb-6">Ledger Entries</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-xs uppercase font-medium text-gray-400 border-b border-gray-100">
                                <th className="pb-3">Date</th>
                                <th className="pb-3">Invoice No</th>
                                <th className="pb-3">Client</th>
                                <th className="pb-3">Description</th>
                                <th className="pb-3 text-right">Credit (₹)</th>
                                <th className="pb-3 text-right">Debit (₹)</th>
                                <th className="pb-3 text-right">Balance (₹)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {ledger.ledgerEntries.length > 0 ? (
                                ledger.ledgerEntries.map((entry, index) => (
                                    <tr key={index} className="text-sm hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 text-gray-600">
                                            {new Date(entry.date).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 font-medium text-primary">{entry.invoiceNo}</td>
                                        <td className="py-4 text-gray-600">{entry.client}</td>
                                        <td className="py-4 text-gray-600">{entry.description}</td>
                                        <td className="py-4 text-right font-semibold text-emerald-600">
                                            {entry.credit > 0 ? `₹${entry.credit.toLocaleString()}` : '-'}
                                        </td>
                                        <td className="py-4 text-right font-semibold text-red-600">
                                            {entry.debit > 0 ? `₹${entry.debit.toLocaleString()}` : '-'}
                                        </td>
                                        <td className="py-4 text-right font-bold">
                                            ₹{entry.balance.toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="py-12 text-center text-gray-400">
                                        No ledger entries for this period
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

export default Reports;
