<script setup>
  defineProps({
    sale: {
      type: Object,
      required: true,
    }
  })
</script>
<template>
  <div class="border-t border-gray-200 space-y-6 py-6">
    <h2 class="text-2xl font-black"> detallas de venta: </h2>
    <p class="font-back text-xl text-gray-500">Productos Vendidos</p>
    <ul role="list" class="mt-6 devide-y evide-gray-200 border-t border-gray-200 text-sm font-medium text-gray-500">
      {{ sale }}
    </ul>
  </div>
</template>
