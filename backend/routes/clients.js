const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const auth = require('../middleware/auth');

// Get all clients for logged-in user
router.get('/', auth, async (req, res) => {
    try {
        const clients = await Client.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json({ clients });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Search clients
router.get('/search', auth, async (req, res) => {
    try {
        const { q } = req.query;
        const clients = await Client.find({
            userId: req.user.id,
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { email: { $regex: q, $options: 'i' } }
            ]
        }).limit(10);
        res.json({ clients });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single client
router.get('/:id', auth, async (req, res) => {
    try {
        const client = await Client.findOne({ _id: req.params.id, userId: req.user.id });
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.json({ client });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create client
router.post('/', auth, async (req, res) => {
    try {
        const { name, email, phone, address, gstNumber } = req.body;

        const client = new Client({
            userId: req.user.id,
            name,
            email,
            phone,
            address,
            gstNumber
        });

        await client.save();
        res.status(201).json({ client });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update client
router.put('/:id', auth, async (req, res) => {
    try {
        const { name, email, phone, address, gstNumber } = req.body;

        const client = await Client.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { name, email, phone, address, gstNumber },
            { new: true }
        );

        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        res.json({ client });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete client
router.delete('/:id', auth, async (req, res) => {
    try {
        const client = await Client.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        res.json({ message: 'Client deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
