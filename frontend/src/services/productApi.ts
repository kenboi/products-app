import { api } from "src/boot/axios";
import type { APIResponse, IProduct, IProductFilterParams, IProductPayload } from "src/types/product";

const productApi = {
    getAll: async (params?: IProductFilterParams): Promise<APIResponse<IProduct[]>> => {
        const response = await api.get('/products', { params });
        return response.data;
    },
    getTree: async (): Promise<APIResponse<IProduct[]>> => {
        const response = await api.get('/products/tree');
        return response.data;
    },
    getById: async (id: number): Promise<APIResponse<IProduct>> => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },
    create: async (payload: IProductPayload): Promise<APIResponse<IProduct>> => {
        const response = await api.post('/products', payload);
        return response.data;
    },

    update: async (id: number, payload: IProductPayload): Promise<APIResponse<IProduct>> => {
        const response = await api.patch(`/products/${id}`, payload);
        return response.data;
    },

    delete: async (id: number): Promise<APIResponse<null>> => {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    },

};

export default productApi;