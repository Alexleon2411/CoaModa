
<script setup>
import { computed } from 'vue';
import { useProductStore } from '../stores/products';
import { formatCurrency } from '../helpers'

  const products = useProductStore()

  const props = defineProps({
    product: {
      type: Object
    }
  })

  const isProductNotAvailable = computed(() => props.product.availability === 0)

</script>
<template>
  <li
    :class="{'opacity-30' : isProductNotAvailable}"
    class="flex items-center space-x-6 border border-gray-200 p-6 bg-white shadow">
    <img
    :src="product.image"
    :alt="product.name"
     class="h-24 w-24">
    <div class="space-y-2 flex-auto">
      <h3 class="text-gray-900">{{product.name}}</h3>
      <p class="font-extrabold">{{ formatCurrency(product.price)  }}</p>
      <p>{{ product.availability }} en Stock </p>
    </div>
    <div class="flex items-center gap-3">
      <RouterLink
        :to="{
          name: 'edit-product',
          params: {id: product.id}
        }"
      >
        <svg class="w-6 h-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
          <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
      </RouterLink>

        <button
          type="button"
          @click="products.deleteProduct(product.id)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-red-500">
            <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" />
          </svg>
        </button>
    </div>
  </li>
</template>
