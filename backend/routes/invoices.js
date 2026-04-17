const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const auth = require('../middleware/auth');

// Get invoice statistics for dashboard
router.get('/stats', auth, async (req, res) => {
    try {
        const invoices = await Invoice.find({ creator: req.user.id });

        const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
        const pendingPayments = invoices
            .filter(inv => inv.status === 'sent' || inv.status === 'viewed')
            .reduce((sum, inv) => sum + inv.total, 0);
        const overdueInvoices = invoices.filter(inv => {
            return inv.status !== 'paid' && new Date(inv.dueDate) < new Date();
        }).length;

        // Calculate this month's earnings
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const thisMonthEarnings = invoices
            .filter(inv => inv.status === 'paid' && new Date(inv.createdAt) >= startOfMonth)
            .reduce((sum, inv) => sum + inv.total, 0);

        // Recent invoices (last 5)
        const recentInvoices = invoices.slice(0, 5);

        // Recent payments (last 5 paid invoices)
        const recentPayments = invoices
            .filter(inv => inv.status === 'paid')
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            .slice(0, 5);

        // Monthly income data for chart (last 6 months)
        const monthlyData = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
            const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            const income = invoices
                .filter(inv => {
                    const invDate = new Date(inv.createdAt);
                    return inv.status === 'paid' && invDate >= monthStart && invDate <= monthEnd;
                })
                .reduce((sum, inv) => sum + inv.total, 0);

            monthlyData.push({
                month: date.toLocaleString('default', { month: 'short' }),
                income
            });
        }

        res.json({
            stats: {
                totalRevenue,
                pendingPayments,
                overdueInvoices,
                thisMonthEarnings
            },
            recentInvoices,
            recentPayments,
            monthlyData
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all invoices with filters
router.get('/', auth, async (req, res) => {
    try {
        const { status, clientEmail, startDate, endDate } = req.query;

        let query = { creator: req.user.id };

        if (status) query.status = status;
        if (clientEmail) query['client.email'] = clientEmail;
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const invoices = await Invoice.find(query).sort({ createdAt: -1 });
        res.json({ invoices });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single invoice
router.get('/:id', auth, async (req, res) => {
    try {
        const invoice = await Invoice.findOne({ _id: req.params.id, creator: req.user.id });
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.json({ invoice });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create invoice
router.post('/', auth, async (req, res) => {
    try {
        // Generate invoice number
        const count = await Invoice.countDocuments({ creator: req.user.id });
        const invoiceNumber = `INV-${Date.now()}-${count + 1}`;

        const invoice = new Invoice({
            ...req.body,
            invoiceNumber,
            creator: req.user.id
        });

        await invoice.save();
        res.status(201).json({ invoice });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update invoice
router.put('/:id', auth, async (req, res) => {
    try {
        const invoice = await Invoice.findOneAndUpdate(
            { _id: req.params.id, creator: req.user.id },
            req.body,
            { new: true }
        );

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        res.json({ invoice });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update invoice status
router.patch('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;

        const invoice = await Invoice.findOneAndUpdate(
            { _id: req.params.id, creator: req.user.id },
            { status },
            { new: true }
        );

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        res.json({ invoice });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete invoice
router.delete('/:id', auth, async (req, res) => {
    try {
        const invoice = await Invoice.findOneAndDelete({ _id: req.params.id, creator: req.user.id });

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        res.json({ message: 'Invoice deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
