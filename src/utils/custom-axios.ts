import { axiosInstance } from "@refinedev/simple-rest";


const customAxiosInstance = axiosInstance;

customAxiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    
    if (token) {
        config.headers.Authorization = token;
        config.headers["Content-Type"] = "application/json";
    }

    return config;
})

export { customAxiosInstance };