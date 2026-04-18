import { defineStore } from "pinia";
import { Notify } from "quasar";
import productApi from "src/services/productApi";

import type { IProduct, IProductFilterParams, IProductPayload } from "src/types/product";
import { computed, ref } from "vue";

export const useProductStore = defineStore('products', () => {
    const products = ref<IProduct[]>([]);
    const productTree = ref<IProduct[]>([]);
    const loading = ref(false);
    const filters = ref<IProductFilterParams>({})

    const productTypes = computed(() => [...new Set(products.value.map(p => p.product_type))]);

    const rootProducts = computed(() => products.value.filter(p => p.product_parent_id === null));

    const fetchProducts = async (params?: IProductFilterParams) => {
        loading.value = true;

        try {
            const res = await productApi.getAll(params);
            products.value = res.data;
        } catch (err) {
            Notify.create({ type: 'negative', message: String(err) })
        } finally {
            loading.value = false;
        }
    }

    const fetchTree = async () => {
        loading.value = true
        try {
            const res = await productApi.getTree()
            productTree.value = res.data
        } catch (error) {
            Notify.create({ type: 'negative', message: String(error) })
        } finally {
            loading.value = false
        }
    }

    const createProduct = async (payload: IProductPayload) => {
        try {
            await productApi.create(payload);
            Notify.create({ type: 'positive', message: 'Product created successfully' });
            await Promise.all([fetchProducts(), fetchTree()]); // refreshes the list after creating
        } catch (err) {
            Notify.create({ type: 'negative', message: String(err) })
        }
    }

    const updateProduct = async (id: number, payload: IProductPayload) => {
        try {
            await productApi.update(id, payload);
            Notify.create({ type: 'positive', message: 'Product updated' });
            await Promise.all([fetchProducts(), fetchTree()]); // refreshes the list after updating
        } catch (err) {
            Notify.create({ type: 'negative', message: String(err) })
        }
    }

    const deleteProduct = async (id: number) => {
        try {
            await productApi.delete(id);
            Notify.create({ type: 'positive', message: 'Product deleted' });
            await Promise.all([fetchProducts(), fetchTree()]); // refreshes the list after deleting
        } catch (err) {
            Notify.create({ type: 'negative', message: String(err) })
        }
    }

    const applyFilters = async (newFilters: IProductFilterParams) => {
        filters.value = newFilters;
        await fetchProducts(newFilters);
    }

    const clearFilters = async () => {
        filters.value = {};
        await fetchProducts();
    }

    return {
        products, productTree, loading, filters,
        productTypes, rootProducts,
        fetchProducts, fetchTree, createProduct,
        updateProduct, deleteProduct,
        applyFilters, clearFilters,
    }


})