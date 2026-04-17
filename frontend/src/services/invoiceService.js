import api from './api';

export const invoiceService = {
    // Get dashboard statistics
    getStats: async () => {
        const response = await api.get('/invoices/stats');
        return response.data;
    },

    // Get all invoices
    getAll: async (filters = {}) => {
        const params = new URLSearchParams(filters).toString();
        const response = await api.get(`/invoices?${params}`);
        return response.data.invoices;
    },

    // Get single invoice
    getById: async (id) => {
        const response = await api.get(`/invoices/${id}`);
        return response.data.invoice;
    },

    // Create invoice
    create: async (invoiceData) => {
        const response = await api.post('/invoices', invoiceData);
        return response.data.invoice;
    },

    // Update invoice
    update: async (id, invoiceData) => {
        const response = await api.put(`/invoices/${id}`, invoiceData);
        return response.data.invoice;
    },

    // Update invoice status
    updateStatus: async (id, status) => {
        const response = await api.patch(`/invoices/${id}/status`, { status });
        return response.data.invoice;
    },

    // Delete invoice
    delete: async (id) => {
        const response = await api.delete(`/invoices/${id}`);
        return response.data;
    },
};
