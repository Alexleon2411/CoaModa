<script setup>
import AdminNav from '../../components/AdminNav.vue';
</script>

<template>
  <AdminNav/>
  <!-- la clase lg:min-h-screen es para indicarle que debe tomar todo el alto de la pantalla  -->
  <div class="pt-32 container mx-auto lg:min-h-screen">
    <RouterView/>
  </div>
</template>
