import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:5000/api",
});

// Request Interceptor: Attach JWT to every request
apiClient.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("booko_token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle auth errors
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Token might be expired or invalid
            if (typeof window !== "undefined") {
                localStorage.removeItem("booko_token");
                localStorage.removeItem("booko_user");

                // Avoid infinite redirect if already on login page
                if (!window.location.pathname.includes("/login")) {
                    window.location.href = "/login";
                }
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
