<script setup>
import Link from '../components/Link.vue'
import Logo from './Logo.vue';
import { useAuthStore } from '../stores/auth';

  const auth = useAuthStore()
</script>
<template>
  <!-- se le da la siguiente configuracion para la barra de navegacion, el absolute es para que mantenga una
   posicion fija y el z-10 es para que se muestre delante de cualquier elemento no importa que no haya un elemento con
   configuracion de relative -->
  <header class="px-10 py-5 bg-gray-700 lg:flex justify-between absolute top-0 w-full z-10">
    <div>
      <Logo/>

    </div>
    <nav class="flex lg:block">
      <!-- se le coloca el to para que este conectado con el componente link en la parte de prop que te permite reutilizar ese
       componente para poder darle un uso dinamico a los router -->
       <div v-if="auth.isAuth">
         <RouterLink :to="{name: 'products'}" class="rounded text-white font-bold p-2">Productos</RouterLink>
         <RouterLink :to="{name: 'sales'}" class="rounded text-white font-bold p-2">Ventas</RouterLink>
         <Link to="shop">Ir a tienda </Link>
         <button @click="auth.logout" class="rounded px-2  text-white bg-blue-400 mx-3" type="button">Cerrar Sesion</button>
       </div>
       <div v-else>
         <Link to="shop">Volver a la tienda </Link>
       </div>
    </nav>
  </header>
</template>
