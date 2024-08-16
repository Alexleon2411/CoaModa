<script setup>
import Link from '../components/Link.vue'
import Logo from './Logo.vue';
import { useAuthStore } from '../stores/auth';
import { computed, ref, watch, onMounted  } from 'vue';

  const auth = useAuthStore()
  const isBigScreen = ref(null)


  //methods para la barra de navegacion

  const onResize = () => {
    isBigScreen.value = window.innerWidth > 960 ? true : false;
    
  }
  onMounted(() => {
    onResize()
  })
</script>
<template>
<!-- para small screen -->
  <div v-if="!isBigScreen" class="position-sticky top-0 left-0 right-0 bg-gray-900 pa-3 w-100" style="z-index: 2;">
    <div class="bg-gray-900 d-flex justify-between">
      <Logo/>
      <div class="align-center pt-1 pr-2 ">
        <v-btn
          size="medium"
          class="text-h6 p-1 m-1"
        >
          <v-icon icon="mdi-menu"></v-icon>
          <v-menu
            activator="parent"
            transition="slide-x-transition"
          >
          <v-list
            min-width="250"
          >
          <nav>
            <!-- se le coloca el to para que este conectado con el componente link en la parte de prop que te permite reutilizar ese
            componente para poder darle un uso dinamico a los router -->
            <div v-if="auth.isAuth" class="d-flex flex-column">
              <RouterLink :to="{name: 'products'}" class="rounded  hover:bg-green-500 font-bold p-1 w-50 ml-2">Productos</RouterLink>
              <RouterLink :to="{name: 'sales'}" class="rounded  hover:bg-green-500 font-bold p-1 w-50 ml-2">Ventas</RouterLink>
              <RouterLink :to="{name: 'shop'}" class="rounded  hover:bg-green-500 font-bold p-1 w-50 ml-2">Ir a tienda</RouterLink>

            </div>
            <div v-else>
              <RouterLink :to="{name: 'shop'}" class="rounded  hover:bg-green-500 font-bold p-1 w-50 ml-2">Volver a la tienda </RouterLink>
            </div>
          </nav>
          <v-divider :thickness="5" inset></v-divider>

          <button v-if="auth.isAuth" @click="auth.logout" class="rounded px-2  text-white bg-blue-400 mx-3" type="button">Cerrar Sesion</button>

            </v-list>
          </v-menu>
        </v-btn>
      </div>
    </div>
  </div>

<!-- para big screen -->
  <!-- se le da la siguiente configuracion para la barra de navegacion, el absolute es para que mantenga una
   posicion fija y el z-10 es para que se muestre delante de cualquier elemento no importa que no haya un elemento con
   configuracion de relative -->
  <header v-else  class="px-10 py-5 bg-gray-700 lg:flex justify-between absolute top-0 w-full z-10">
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
