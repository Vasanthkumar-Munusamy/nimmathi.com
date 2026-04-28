import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' },
});

// Response interceptor — handle 401 globally
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem('nimmathi_user');
            window.location.href = '/login';
        }
        return Promise.reject(err);
    }
);

export default api;

// ─── API helpers ─────────────────────────────────────────────────────────────
export const postsAPI = {
    getAll: (params) => api.get('/posts', { params }),
    getBySlug: (slug) => api.get(`/posts/${slug}`),
    create: (data) => api.post('/posts', data),
    update: (id, data) => api.put(`/posts/${id}`, data),
    delete: (id) => api.delete(`/posts/${id}`),
};

export const audioAPI = {
    getAll: (params) => api.get('/audio', { params }),
    getById: (id) => api.get(`/audio/${id}`),
    upload: (data) => api.post('/audio', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    delete: (id) => api.delete(`/audio/${id}`),
};

export const matrimonialAPI = {
    getAll: (params) => api.get('/matrimonial', { params }),
    getById: (id) => api.get(`/matrimonial/${id}`),
    create: (data) => api.post('/matrimonial', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    update: (id, data) => api.put(`/matrimonial/${id}`, data),
    delete: (id) => api.delete(`/matrimonial/${id}`),
};

export const qaAPI = {
    getAll: (params) => api.get('/qa', { params }),
    getById: (id) => api.get(`/qa/${id}`),
    create: (data) => api.post('/qa', data),
    addAnswer: (id, data) => api.post(`/qa/${id}/answer`, data),
};

export const authAPI = {
    login: (data) => api.post('/auth/login', data),
    register: (data) => api.post('/auth/register', data),
    getMe: () => api.get('/auth/me'),
};

export const contactAPI = {
    send: (data) => api.post('/contact', data),
};