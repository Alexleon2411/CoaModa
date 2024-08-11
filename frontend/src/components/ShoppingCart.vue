<script setup>
import { useCartStore } from '../stores/cart';
import ShooppingCartItem from './ShoopingCartItem.vue'
import Amount from './Amount.vue';
import { formatCurrency } from '../helpers';
import Link from './Link.vue';
import CouponForm from './CouponForm.vue';
import { useCouponStore } from '../stores/coupons';

const cart = useCartStore();
const coupon = useCouponStore();
</script>

<template>
  <main style="width: 100%; display: flex; justify-content: center; align-items: center;">

    <div style="width: 80%; height: 100%; background-repeat: no-repeat; justify-content: center; margin-top: 15px;">
      <Link to="shop" >volver</Link>
      <p v-if="cart.isEmpty" class="text-xl text-center text-gray-900">El Carrito esta vacio </p>
      <div v-else>
        <p class="text-4xl font-bold text-gray-900 items-center mt-5"> Resumen de compra</p>

        <ul
          role="list"
          class="mt-6 divide-y divide-gray-200"
        >
        <ShooppingCartItem
          v-for="item in cart.items"
          :key="item.id"
          :item="item"
        />
        </ul>
        <dl>
          <Amount>
            <template #label>Subtotal: </template>
            {{ formatCurrency(cart.subTotal) }}
          </Amount>
          <Amount>
            <template #label>Ivas: </template>
            {{ formatCurrency(cart.taxes) }}
          </Amount>
          <Amount v-if="coupon.isValidCoupon">
            <template #label>Descuento: </template>
            {{ formatCurrency(coupon.discount) }}
          </Amount>
          <Amount>
            <template #label>Total a pagar: </template>
            {{ formatCurrency(cart.total) }}
          </Amount>
        </dl>
        <CouponForm/>
        <div class="mt-5">
          <Link to="info">Confirmar Compra</Link>
        </div>
      </div>
    </div>
  </main>
</template>
