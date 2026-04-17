const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import auth middleware
const auth = require('./middleware/auth');

// Routes
const authRoutes = require('./routes/auth');
const invoiceRoutes = require('./routes/invoices');
const clientRoutes = require('./routes/clients');
const messageRoutes = require('./routes/messages');
const reportRoutes = require('./routes/reports');

app.use('/api/auth', authRoutes);
app.use('/api/invoices', auth, invoiceRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reports', reportRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'LedgerFixo API is running', version: '1.0.0' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
});
