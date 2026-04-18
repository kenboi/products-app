<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useProductStore } from 'src/stores/productStore';
import { IProduct } from 'src/types/product'
import { computed, ref } from 'vue';
import ProductDialog from './ProductDialog.vue';


const props = defineProps<{
    product: IProduct
    depth?: number
}>()

const currentDepth = computed(() => props.depth ?? 0)
const indentStyle = computed(() => ({ paddingLeft: `${currentDepth.value * 24}px` }));

const expanded = ref(false)
const hasChildren = computed(() => !!props.product.children?.length);

const showEditDialog = ref(false)
const showAddChildDialog = ref(false)

const $q = useQuasar()
const productStore = useProductStore()

const onDelete = () => {
    $q.dialog({
        title: 'Confirm Delete',
        message: `Are you sure you want to delete "${props.product.product_name}"?`,
        cancel: true,
        persistent: true
    }).onOk(async () => {
        await productStore.deleteProduct(props.product.product_id)
    })
}





</script>
<template>
    <q-card :style="indentStyle">
        <q-btn flat round dense :icon="expanded ? 'expand_less' : 'expand_more'"
            :visibility="hasChildren ? 'visible' : 'hidden'" @click="expanded = !expanded" />

        <span>{{ product.product_name }}</span>
        <span class="text-caption text-grey">{{ product.product_type }}</span>



        <q-btn flat icon="add" @click="showAddChildDialog = true" />
        <q-btn flat icon="edit" @click="showEditDialog = true" />
        <q-btn flat icon="delete" color="negative" @click="onDelete" />


        <q-slide-transition>
            <div v-if="expanded">
                <ProductTreeNode v-for="child in product.children" :key="child.product_id" :product="child"
                    :depth="currentDepth + 1" />
            </div>
        </q-slide-transition>

        <ProductDialog v-model="showEditDialog" :product="product" />

        <ProductDialog v-model="showAddChildDialog" :parentProduct="product" />

    </q-card>

</template>