<script setup>
import { formatCurrency } from '../helpers'
import { useCartStore } from '../stores/cart'
import { ref } from 'vue';

const cart = useCartStore();
const textAlert = ref('');
const show = ref(false);

  defineProps({
    product: {
      type: Object
    }
  })
  const showAlert = async (product) => {
    await cart.addItem(product);
    textAlert.value = 'Producto agregado al carrito';
    show.value = true;

    // Ocultar la alerta después de unos segundos
    setTimeout(() => {
      show.value = false;
    }, 3000);
  };
</script>
<template>
  <div class="rounded bg-white shadow relative">
    <v-alert
      color="success"
      icon="$success"
      v-if="show"
      class="mt-4 lg:mt-0"
    >
      {{ textAlert }}
    </v-alert>
    <img :src="product.image" :alt="'imagen de' + product.name">

    <div class="p-3 space-y-2 ">
      <h3 class="text-xl font-black text-gray-500"> {{ product.name }}</h3>
      <p class="text-gray-500"> Disponible: {{ product.availability }}</p>
      <p class="text-2xl font-extrabold text-gray-900">{{ formatCurrency(product.price) }}</p>
    </div>
    <div>
      <button type="button" class="absolute top-5 right-5 alert alert-success" @click="showAlert(product)">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 bg-indigo-600 rounded-full text-white">
          <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clip-rule="evenodd" />
        </svg>

      </button>
    </div>
  </div>
</template>
