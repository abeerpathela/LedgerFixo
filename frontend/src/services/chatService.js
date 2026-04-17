import api from './api';

export const chatService = {
    // Get all conversations
    getConversations: async () => {
        const response = await api.get('/messages/conversations');
        return response.data.conversations;
    },

    // Get messages with a specific user
    getMessages: async (partnerId) => {
        const response = await api.get(`/messages/${partnerId}`);
        return response.data.messages;
    },

    // Send message
    sendMessage: async (messageData) => {
        const response = await api.post('/messages', messageData);
        return response.data.message;
    },
};
