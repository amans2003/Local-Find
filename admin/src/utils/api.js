import axios from 'axios';

const api = axios.create({ baseURL: `${import.meta.env.VITE_API_URL || ''}/api/v1`, withCredentials: true });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (err, token = null) => {
  failedQueue.forEach((p) => (err ? p.reject(err) : p.resolve(token)));
  failedQueue = [];
};

const clearAdminSession = () => {
  localStorage.removeItem('adminToken');
  window.location.href = '/admin/login';
};

api.interceptors.response.use(
  (r) => r,
  async (err) => {
    const original = err.config;
    const status = err.response?.status;
    const isLoginRoute = original.url?.includes('/auth/login');

    // 403 means token is valid but user is not admin — session is corrupted, force re-login
    if (status === 403 && !isLoginRoute) {
      clearAdminSession();
      return Promise.reject(err);
    }

    if (status === 401 && !original._retry && !isLoginRoute) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          '/api/v1/auth/admin-refresh',
          {},
          { withCredentials: true }
        );
        const newToken = data.data.accessToken;

        // Safety check: verify the refreshed token is for an admin
        try {
          const payload = JSON.parse(atob(newToken.split('.')[1]));
          if (payload.role !== 'admin') {
            processQueue(new Error('Not admin'), null);
            clearAdminSession();
            return Promise.reject(err);
          }
        } catch {
          processQueue(new Error('Token parse error'), null);
          clearAdminSession();
          return Promise.reject(err);
        }

        localStorage.setItem('adminToken', newToken);
        processQueue(null, newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        processQueue(new Error('Session expired'), null);
        clearAdminSession();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default api;
