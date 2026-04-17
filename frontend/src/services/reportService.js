import api from './api';

export const reportService = {
    // Get financial ledger
    getLedger: async (filters = {}) => {
        const params = new URLSearchParams(filters).toString();
        const response = await api.get(`/reports/ledger?${params}`);
        return response.data;
    },

    // Get GST summary
    getGSTSummary: async (filters = {}) => {
        const params = new URLSearchParams(filters).toString();
        const response = await api.get(`/reports/gst?${params}`);
        return response.data;
    },
};
