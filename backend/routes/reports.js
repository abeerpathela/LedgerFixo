const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const auth = require('../middleware/auth');

// Get financial ledger
router.get('/ledger', auth, async (req, res) => {
    try {
        const { startDate, endDate, period } = req.query;

        let query = { creator: req.user.id };

        // Handle period shortcuts
        if (period) {
            const now = new Date();
            switch (period) {
                case 'thisMonth':
                    query.createdAt = { $gte: new Date(now.getFullYear(), now.getMonth(), 1) };
                    break;
                case 'thisYear':
                    query.createdAt = { $gte: new Date(now.getFullYear(), 0, 1) };
                    break;
                case 'financialYear':
                    const fyStart = now.getMonth() >= 3 ? new Date(now.getFullYear(), 3, 1) : new Date(now.getFullYear() - 1, 3, 1);
                    query.createdAt = { $gte: fyStart };
                    break;
            }
        } else if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const invoices = await Invoice.find(query).sort({ createdAt: 1 });

        // Build ledger entries
        let balance = 0;
        const ledgerEntries = invoices.map(invoice => {
            const credit = invoice.status === 'paid' ? invoice.total : 0;
            const debit = 0; // In a full system, you'd track expenses too
            balance += credit - debit;

            return {
                date: invoice.createdAt,
                invoiceNo: invoice.invoiceNumber,
                client: invoice.client.name,
                description: `Invoice for ${invoice.items.map(i => i.name).join(', ')}`,
                credit,
                debit,
                balance
            };
        });

        const summary = {
            openingBalance: 0,
            totalCredit: ledgerEntries.reduce((sum, entry) => sum + entry.credit, 0),
            totalDebit: ledgerEntries.reduce((sum, entry) => sum + entry.debit, 0),
            netProfit: 0,
            closingBalance: balance
        };

        summary.netProfit = summary.totalCredit - summary.totalDebit;

        res.json({ ledgerEntries, summary });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get GST summary
router.get('/gst', auth, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        let query = { creator: req.user.id };

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const invoices = await Invoice.find(query);

        let totalCGST = 0;
        let totalSGST = 0;
        let totalIGST = 0;

        const gstInvoices = invoices.map(invoice => {
            const cgst = invoice.items.reduce((sum, item) => {
                return sum + (item.taxType === 'CGST' ? (item.quantity * item.rate * item.taxRate / 100) : 0);
            }, 0);

            const sgst = invoice.items.reduce((sum, item) => {
                return sum + (item.taxType === 'SGST' ? (item.quantity * item.rate * item.taxRate / 100) : 0);
            }, 0);

            const igst = invoice.items.reduce((sum, item) => {
                return sum + (item.taxType === 'IGST' ? (item.quantity * item.rate * item.taxRate / 100) : 0);
            }, 0);

            totalCGST += cgst;
            totalSGST += sgst;
            totalIGST += igst;

            return {
                invoiceNumber: invoice.invoiceNumber,
                date: invoice.createdAt,
                client: invoice.client.name,
                taxableAmount: invoice.subtotal,
                cgst,
                sgst,
                igst,
                total: invoice.total
            };
        });

        const summary = {
            totalCGST,
            totalSGST,
            totalIGST,
            totalGST: totalCGST + totalSGST + totalIGST
        };

        res.json({ gstInvoices, summary });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
