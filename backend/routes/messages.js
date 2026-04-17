const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const auth = require('../middleware/auth');

// Get all conversations for user
router.get('/conversations', auth, async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [{ sender: req.user.id }, { receiver: req.user.id }]
        }).sort({ createdAt: -1 });

        // Group by conversation partner
        const conversationsMap = new Map();

        messages.forEach(msg => {
            const partnerId = msg.sender.toString() === req.user.id ? msg.receiver.toString() : msg.sender.toString();

            if (!conversationsMap.has(partnerId)) {
                conversationsMap.set(partnerId, {
                    partnerId,
                    lastMessage: msg.message,
                    lastMessageTime: msg.createdAt,
                    unreadCount: 0
                });
            }
        });

        const conversations = Array.from(conversationsMap.values());
        res.json({ conversations });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get messages between two users
router.get('/:partnerId', auth, async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user.id, receiver: req.params.partnerId },
                { sender: req.params.partnerId, receiver: req.user.id }
            ]
        }).sort({ createdAt: 1 });

        res.json({ messages });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Send message
router.post('/', auth, async (req, res) => {
    try {
        const { receiver, message, invoiceId } = req.body;

        const newMessage = new Message({
            sender: req.user.id,
            receiver,
            message,
            invoiceId
        });

        await newMessage.save();
        res.status(201).json({ message: newMessage });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
