<script setup lang="ts">
import { useQuasar } from 'quasar';
import { onMounted, ref } from 'vue';
import ProductDialog from 'src/components/ProductDialog.vue';
import ProductTreeNode from 'src/components/ProductTreeNode.vue';
import { useProductStore } from 'src/stores/productStore';
import type { IProduct } from 'src/types/product';
import type { QTableProps } from 'quasar'

const productStore = useProductStore()
const $q = useQuasar()

onMounted(async () => {
    await Promise.all([productStore.fetchProducts(), productStore.fetchTree()])
})

const viewMode = ref<'tree' | 'table'>('tree')

const columns: QTableProps['columns'] = [
    { name: 'product_name', label: 'Name', field: 'product_name', sortable: true, align: 'left' },
    { name: 'product_type', label: 'Type', field: 'product_type', sortable: true, align: 'left' },
    { name: 'product_parent_id', label: 'Parent ID', field: 'product_parent_id', sortable: true, align: 'left' },
    { name: 'actions', label: 'Actions', field: 'actions', align: 'center' },
]
const filterName = ref('')
const filterType = ref('')

const onFilter = async () => {
    viewMode.value = 'table';
    await productStore.applyFilters({
        product_name: filterName.value || undefined,
        product_type: filterType.value || undefined,
    })
}

const onClear = async () => {
    filterName.value = ''
    filterType.value = ''
    await productStore.clearFilters()
}

const showDialog = ref(false)
const dialogProduct = ref<IProduct | null>(null)
const dialogParent = ref<IProduct | null>(null)

const openAdd = () => {
    dialogProduct.value = null
    dialogParent.value = null
    showDialog.value = true
}

const openEdit = (product: IProduct) => {
    dialogProduct.value = product
    dialogParent.value = null
    showDialog.value = true
}

const openAddChild = (parent: IProduct) => {
    dialogProduct.value = null
    dialogParent.value = parent
    showDialog.value = true
}

const openDelete = (product: IProduct) => {
    $q.dialog({
        title: 'Confirm Delete',
        message: `Are you sure you want to delete "${product.product_name}"?`,
        cancel: true,
        persistent: true
    }).onOk(() => {
        void productStore.deleteProduct(product.product_id) // added void so i dont have to await for it which silences the linter
    })
}
</script>

<template>
    <q-page padding>
        <div class="row items-center q-mb-md">
            <div class="text-h5 col">Products</div>
            <q-btn label="Add Product" color="primary" icon="add" @click="openAdd" />
        </div>

        <div class="row q-gutter-md q-mb-md items-center">
            <q-input v-model="filterName" label="Search by name" clearable style="min-width: 200px"
                @update:model-value="onFilter" />
            <q-select v-model="filterType" :options="productStore.productTypes" label="Filter by type" clearable
                style="min-width: 200px" @update:model-value="onFilter" />
            <q-btn label="Clear" flat @click="onClear" />
        </div>

        <!-- Toggle tree-->
        <q-btn-toggle v-model="viewMode" class="q-mb-md" :options="[
            { label: 'Tree', value: 'tree' },
            { label: 'Table', value: 'table' }
        ]" />
        <!--Tree-->
        <div v-if="viewMode === 'tree'">
            <ProductTreeNode v-for="product in productStore.productTree" :key="product.product_id" :product="product"
                :depth="0" />
        </div>

        <!-- Table -->
        <q-table v-else :rows="productStore.products" :columns="columns" row-key="product_id"
            :loading="productStore.loading">
            <template #body-cell-product_parent_id="{ row }">
                <q-td>
                    <q-badge v-if="row.product_parent_id === null" label="Root" color="primary" />
                    <span v-else>{{ row.product_parent_id }}</span>
                </q-td>
            </template>
            <template #body-cell-actions="{ row, col }">
                <q-td :props="{ row, col }">
                    <q-btn flat round dense icon="add" size="sm" @click="openAddChild(row)" />
                    <q-btn flat round dense icon="edit" size="sm" @click="openEdit(row)" />
                    <q-btn flat round dense icon="delete" size="sm" color="negative" @click="openDelete(row)" />
                </q-td>
            </template>
        </q-table>

        <ProductDialog v-model="showDialog" :product="dialogProduct" :parentProduct="dialogParent" />
    </q-page>
</template>
