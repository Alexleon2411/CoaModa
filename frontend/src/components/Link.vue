<script setup>
import { RouterLink } from 'vue-router';

// el siguiente prop es para tener un router dinamico dependiendo del nombre que le estemos dando al prop es el routerlink que se va a usar
  defineProps({
    to: {
      type: String
    }
  })
</script>
<template>
  <!-- se le colocan la configuracion css al routerlink para no tener que esta repitiendo el codigo css a todos los links  -->
  <RouterLink
    :to="{name: to}"
    class="rounded bg-green-400 hover:bg-green-500 font-bold py-1 lg:py-2  px-1 lg:px-10">
    <slot></slot>
  </RouterLink>
</template>
