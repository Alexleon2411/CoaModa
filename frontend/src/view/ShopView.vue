<script setup>
import MainNav from '../components/MainNav.vue';
import ProductCard from '../components/ProductCard.vue';
import { useProductStore } from '../stores/products';
import { storeToRefs } from 'pinia' // esto se utiliza para mantener la reactividad al momento de aplicar destrototing
import { useCartStore } from '../stores/cart';
import ShoopingCart from '../components/ShoppingCart.vue'
import { watch } from 'vue';

const cart = useCartStore()
let isEmpty = false
const product = useProductStore();
const { filteredProducts, noResults } = storeToRefs(product) // como en este caso que estamos aplicacion distrotoing  y para no perder la reactividad usams storeToRefs
const emit = defineEmits(['cartEmpty']);

watch(() => cart.isEmpty, (newVal) => {
  if (newVal) {
    emit('cartEmpty');
    isEmpty = true
    deep: true
  }
  else {
    isEmpty = false
    deep: true
  }
} );
</script>

<template>
  <MainNav/>
  <main class="pt-10 lg:flex lg:h-screen lg:overflow-y-hidden">
    <div :class="[isEmpty ? 'lg:w-2/3' : 'w-full', 'lg:screen lg:overflow-y-scroll py-32 lg:py-24 px-10']">
      <p v-if="noResults" class="text-center text-4xl">No hay productos </p>
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
        <ProductCard
          v-for="product in filteredProducts" :key="product.id" :product="product"
        />
      </div>
    </div>
    <!-- <aside v-if="!cart.isEmpty" class="lg:w-1/3 lg:screen lg:overflow-y-scroll pt-10 py-32 lg:py-24 px-10">
      <div >
        <ShoopingCart  @cartEmpty="handleCartEmpty"/>
      </div>
    </aside> -->
  </main>
</template>
