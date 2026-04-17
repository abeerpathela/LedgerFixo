import api from './api';

export const clientService = {
    // Get all clients
    getAll: async () => {
        const response = await api.get('/clients');
        return response.data.clients;
    },

    // Search clients
    search: async (query) => {
        const response = await api.get(`/clients/search?q=${query}`);
        return response.data.clients;
    },

    // Get single client
    getById: async (id) => {
        const response = await api.get(`/clients/${id}`);
        return response.data.client;
    },

    // Create client
    create: async (clientData) => {
        const response = await api.post('/clients', clientData);
        return response.data.client;
    },

    // Update client
    update: async (id, clientData) => {
        const response = await api.put(`/clients/${id}`, clientData);
        return response.data.client;
    },

    // Delete client
    delete: async (id) => {
        const response = await api.delete(`/clients/${id}`);
        return response.data;
    },
};
