<script setup>
  import { formatCurrency } from '../helpers';
  import { ref, watch } from 'vue';
  import Amount from './Amount.vue'
  import { useSalesStore } from '../stores/sales';

  defineProps({
    sale: {
      type: Object,
      required: true,
    }
  })

  const sales = useSalesStore()
  const emit = defineEmits(['update-status']);

  const localStatus = ref(sales.status);

  // Watch for changes in the local status to emit updates
  watch(localStatus, (newStatus) => {
    emit('update-status', newStatus);
  });

  const updateStatus = () => {
    emit('update-status', localStatus.value);
  };
</script>
<template>
  <div class="border-t border-gray-200 space-y-6 py-6">
    <h2 class="text-2xl font-black"> Detallas de venta: </h2>
    <p class="font-back text-xl text-gray-500">Productos Vendidos</p>
    <ul role="list" class="mt-6 devide-y evide-gray-200 border-t border-gray-200 text-sm font-medium text-gray-500">
      <li
      v-for="item in sale.items"
      class="flex space-x-6 py-6 d-flex">
      <img
        :src="item.image"
        :alt="'imagen de' + item.name"
        class="h-24 w-24 flex-none rounded-lg"
      >
      <div class="flex-auto">
        <h3 class="text-gray-900">{{ item.name }}</h3>
        <p>{{ formatCurrency(item.price) }}</p>
        <p>Cantidad:{{ item.quantity }}</p>
      </div>
    </li>
  </ul>
  <dl class="space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-gray-500">
      <Amount>
        <template #label>Subtotal: </template>
        {{ formatCurrency(sale.subTotal) }}
      </Amount>
      <Amount>
        <template #label>Ivas: </template>
        {{ formatCurrency(sale.taxes) }}
      </Amount>
      <Amount v-if="sale.discount" class="bg-green-200 p-2">
            <template #label>Descuento: </template>
            {{ formatCurrency(sale.discount) }}
          </Amount>
      <Amount>
        <template #label>Total a pagar: </template>
        {{ formatCurrency(sale.total) }}
      </Amount>
      <v-row>
        <v-col cols="12">
          <p>Estado: {{ sale.status }}</p>
        </v-col>
        <v-col cols="12">
          <v-select
            :items="['pendiente', 'realizada', 'cancelada']"
            v-model="localStatus"
            @change="updateStatus"
            variant="outlined"
            class="w-25"
          ></v-select>
        </v-col>
      </v-row>
      <!-- Botón para cambiar el estado -->
    </dl>
  </div>
</template>
