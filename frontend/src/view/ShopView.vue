<script setup>
import MainNav from '../components/MainNav.vue';
import ProductCard from '../components/ProductCard.vue';
import { useProductStore } from '../stores/products';
import { storeToRefs } from 'pinia' // esto se utiliza para mantener la reactividad al momento de aplicar destrototing
import { useCartStore } from '../stores/cart';
import ShoopingCart from '../components/ShoppingCart.vue'
import { watch, ref, onMounted } from 'vue';

const cart = useCartStore()
let isEmpty = false
const product = useProductStore();
const { filteredProducts, noResults } = storeToRefs(product) // como en este caso que estamos aplicacion distrotoing  y para no perder la reactividad usams storeToRefs
const emit = defineEmits(['cartEmpty']);
const isSmallScreen = ref(null)

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


  const onResize = () => {

    if (window.innerWidth >= 768) {
      isSmallScreen.value = true;
    }
  }

  onMounted(() => {
    onResize()
  })
</script>

<template>
  <div class="position-realtive">

    <MainNav/>
    <main class="pt-10 lg:flex lg:h-screen lg:overflow-y-hidden" >
      <div
        :class="[
          isEmpty ? 'lg:w-2/3' : 'w-full',
          isSmallScreen ? 'pt-24 py-32 lg:py-24 px-10' : 'py-0 lg:py-0 px-10',
          'lg:screen lg:overflow-y-scroll'
        ]
        " style="z-index: 1 !important;"
      >
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
  </div>
</template>
