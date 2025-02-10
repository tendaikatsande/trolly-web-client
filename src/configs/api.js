import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

// Add a request interceptor to attach the access token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is due to an expired token (401 Unauthorized)
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // Mark the request as retried to avoid infinite loops

      try {
        // Attempt to refresh the access token
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/refresh`,
          {
            refresh_token: refreshToken,
          }
        );

        const { access_token } = response.data;

        // Save the new access token
        localStorage.setItem("access_token", access_token);

        // Update the original request's headers with the new access token
        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        // Retry the original request with the new access token
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Failed to refresh access token:", refreshError);

        // If token refresh fails, clear tokens and redirect to login
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        history.push("/login");
        return Promise.reject(refreshError);
      }
    }

    // For other errors, redirect to login if it's a 401 error
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized. Redirecting to login page.", error);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      history.push("/login");
    }

    return Promise.reject(error);
  }
);

export default api;
