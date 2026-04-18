<script setup lang="ts">
import { useProductStore } from 'src/stores/productStore';
import { IProduct } from 'src/types/product';
import { computed, ref, watch } from 'vue';


const { modelValue, product, parentProduct } = defineProps<{
    modelValue: boolean,
    product?: IProduct | null,
    parentProduct?: IProduct | null
}>();

const isEdit = computed(() => !!product)
const dialogTitle = computed(() => isEdit.value ? 'Edit Product ' : 'Add Product');

const productStore = useProductStore();
const parentOptions = computed(() => productStore.products.filter(p => p.product_id !== product?.product_id))

const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>();

const isOpen = computed({
    get: () => modelValue,
    set: (value) => emit('update:modelValue', value)
});

const form = ref({
    product_name: '',
    product_type: '',
    product_parent_id: null as number | null
})

const onSubmit = async () => {
    if (isEdit.value) {
        await productStore.updateProduct(product!.product_id, form.value)
    } else {
        await productStore.createProduct(form.value);
    }
    isOpen.value = false;
}

watch(isOpen, (value) => {
    if (value) {

        form.value = {
            product_name: product?.product_name ?? '',
            product_type: product?.product_type ?? '',
            product_parent_id: product?.product_parent_id ?? parentProduct?.product_id ?? null

        }
    }
})

</script>
<template>
    <q-dialog v-model="isOpen">
        <q-card style="min-width:450px">
            <q-card-section>
                <div class="text-h6">{{ dialogTitle }}</div>
            </q-card-section>
            <q-card-section>
                <q-input v-model="form.product_name" label="Product Name" />

                <q-select v-model="form.product_type" :options="productStore.productTypes" label="Product Type"
                    use-input new-value-mode="add-unique" />

                <q-select v-model="form.product_parent_id" :options="parentOptions" option-value="product_id"
                    option-label="product_name" emit-value map-options label="Parent Product" clearable />
            </q-card-section>
            <q-card-actions>
                <q-btn label="Cancel" @click="isOpen = false" />
                <q-btn label="Submit" color="primary" @click="onSubmit" />
            </q-card-actions>
        </q-card>


    </q-dialog>
</template>