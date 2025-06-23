import axios from 'axios';

// Add type for failed queue items
type FailedQueueItem = {
  resolve: (token?: string) => void;
  reject: (error: unknown) => void;
};

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (token) prom.resolve(token);
    else prom.reject(error);
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;
    if (
      err.response?.status === 401 &&
      !originalRequest._retry &&
      typeof window !== 'undefined'
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          originalRequest._retry = true;
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        axios
          .post('/api/auth/refresh-token', null, { withCredentials: true })
          .then(res => {
            if (res.status === 200) {
              processQueue(null);
              resolve(axiosInstance(originalRequest));
            } else {
              throw new Error('Refresh failed');
            }
          })
          .catch(error => {
            processQueue(error);
            const path = window.location.pathname + window.location.search;
            window.location.href = `/silent-refresh?from=${encodeURIComponent(path)}`;
            reject(error);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(err);
  }
);

export default axiosInstance;
