const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['InvoiceSent', 'InvoiceViewed', 'InvoicePaid', 'InvoiceOverdue', 'NewMessage'], required: true },
    content: { type: String, required: true },
    relatedId: { type: mongoose.Schema.Types.ObjectId }, // ID of the invoice or message
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
