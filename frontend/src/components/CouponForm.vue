<script setup>
import { useCouponStore } from '../stores/coupons';

const store = useCouponStore()

</script>
<template>
  <!-- border-t es para que el border este en la parte de arriba -->
  <p class="mt-5 py-5 font-bold border-t border-gray-200"> Canjear cupón</p>
  <div class="flex">
    <input type="text" placeholder="ingrasar el cupon" class="p-2 bg-white border-gray-300 w-full" v-model="store.couponInput">
    <button type="button" class="p-3 bg-green-400 font-bold" @click="store.applyCoupon" :disabled="store.isValidCoupon">Canjear </button>
  </div>
  <p class="text-red-500 ml-3 font-extrabold">
    {{ store.couponMessage }}
  </p>
</template>
