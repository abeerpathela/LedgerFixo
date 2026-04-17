const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    invoiceNumber: { type: String, required: true, unique: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    client: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        address: { type: String },
        gstin: { type: String },
        state: { type: String }
    },
    items: [{
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        rate: { type: Number, required: true },
        taxRate: { type: Number, default: 0 },
        amount: { type: Number, required: true }
    }],
    subTotal: { type: Number, required: true },
    totalTax: { type: Number, required: true },
    cgst: { type: Number, default: 0 },
    sgst: { type: Number, default: 0 },
    igst: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['Draft', 'Sent', 'Viewed', 'Paid', 'Overdue'], default: 'Draft' },
    issueDate: { type: Date, default: Date.now },
    dueDate: { type: Date },
    notes: { type: String },
    attachments: [{ type: String }],
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    paidAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Invoice', invoiceSchema);
