import { defineBoot } from "@quasar/app-vite/wrappers";
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

api.interceptors.response.use( //vibe-check: is this some sort of middle ware?
    (response) => response,
    (error) => {
        const message = error.response?.data?.message;
        return Promise.reject(new Error(message || 'An unknown error occurred'))
    }
);

export default defineBoot(({ app }) => {
    app.config.globalProperties.$axios = axios
    app.config.globalProperties.$api = api;
})

export { api }