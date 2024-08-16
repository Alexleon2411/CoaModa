<script setup>
import Link from '../components/Link.vue'
import Logo from './Logo.vue';
import { useProductStore } from '../stores/products';
import { useCartStore } from '../stores/cart';
import { useAuthStore } from '../stores/auth';
import { computed, ref, watch, onMounted  } from 'vue';

const auth = useAuthStore();
const showMenu = ref(true)
const isBigScreen = ref(null)
const products = useProductStore();
const cart = useCartStore();

//methods para la barra de navegacion

  const onResize = () => {
    isBigScreen.value = window.innerWidth > 960 ? true : false;
    if (window.innerWidth >= 960) {
      showMenu.value = false;
    }
    if (window.innerWidth >= 500) {
      showMenu.value = true;
    }
  }
  onMounted(() => {
    onResize()
  })




/* la siguiente computed es para indicar a que ruta se debe dirigir al precionar administrar, si esta logueado se va a dirigir a los productos sino se dirige al panel de login */
const endPoint = computed(() => {
  return auth.isAuth ? 'products' : 'login'
})

</script>
<template>
  <!-- header para small screen -->
  <div v-if="!isBigScreen" class="position-sticky top-0 left-0 right-0 bg-gray-900 pa-3 w-100" style="z-index: 2;">
    <div class="bg-gray-900 d-flex justify-between">
      <RouterLink to="/">
        <div class="flex">
          <h1
          class="text-3xl font-black text-white "
          >
            COA<span class="text-green-400">Moda</span>
          </h1>
        </div>
      </RouterLink>
      <div class="align-center pt-1 pr-2 ">
        <v-btn
          size="medium"
          class="text-h6 p-1 m-1"
        >
        <v-badge color="error" :content="cart.items.length"  v-if="cart.items.length !== 0"  class="mb-3 " style="position: absolute;  top: 0 !important; right: 0 !important;">
        </v-badge>
          <v-icon icon="mdi-menu"></v-icon>
          <v-menu
            activator="parent"
            transition="slide-x-transition"
          >
          <v-list
          min-width="250"
          >
            <h2 class="text-lg font-extrabold ml-2 d-flex justify-center"> Filtros:</h2>
              <div class="flexx items-center gap-2" v-for="category in products.categories" :key="products.id">
                <input type="radio"
                  name="category"
                  :value="category.id"
                  class="h-4 w-4 border text-indigo-700  focus:ring-indigo-500 ml-3"
                  :checked="products.selectCategory === category.id"
                  @change="products.selectCategory = +$event.target.value"
                >
                <!-- el signo de mas (+) que se coloca al principio de $event es para convertir los valores de string a numero enteros de esta manera se puede cambiar el valor de selectCategory -->
                <label class="text-gray-900 ml-3"> {{ category.name }}</label>
              </div>

              <v-divider class="my-2"></v-divider>

              <v-list-item min-height="24">
                  <nav class="d-flex lg:block p-4" >
                    <!-- se le coloca el to para que este conectado con el componente link en la parte de prop que te permite reutilizar ese
                    componente para poder darle un uso dinamico a los router -->
                    <Link :to="endPoint" class="">Administrar</Link>
                      <Link  to="cart" class="ml-2 add-to-cart">
                        Carrito
                        <v-badge color="error" :content="cart.items.length"  v-if="cart.items.length !== 0" floating class="mb-3">
                        </v-badge>
                      </Link>
                  </nav>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
      </div>
    </div>

  </div>

  <!-- header para big screen -->
  <!-- se le da la siguiente configuracion para la barra de navegacion, el absolute es para que mantenga una
   posicion fija y el z-10 es para que se muestre delante de cualquier elemento no importa que no haya un elemento con
   configuracion de relative -->
  <header v-else  class="px-10 py-5 bg-gray-900 flex flex-col lg:flex-row gap-5 lg:item-center lg:justify-between absolute top-0 w-full z-10">
    <div>
        <Logo/>
      <div class="flex gap-5 text-white">
        <h2 class="text-lg font-extrabold"> Filtros: </h2>
        <div class="flexx items-center gap-2" v-for="category in products.categories" :key="products.id">
          <input type="radio"
           name="category"
           :value="category.id"
           class="h-4 w-4 rounded border-gray-300 text-indigo-600 mr-2 focus:ring-indigo-500"
           :checked="products.selectCategory === category.id"
           @change="products.selectCategory = +$event.target.value"
           >
           <!-- el signo de mas (+) que se coloca al principio de $event es para convertir los valores de string a numero enteros de esta manera se puede cambiar el valor de selectCategory -->
          <label class="text-gray-100"> {{ category.name }}</label>
        </div>
      </div>
    </div>
    <nav class="flex lg:block mt-3">
      <!-- se le coloca el to para que este conectado con el componente link en la parte de prop que te permite reutilizar ese
       componente para poder darle un uso dinamico a los router -->
      <Link :to="endPoint" class="">Administrar</Link>
        <Link  to="cart" class="ml-2 add-to-cart">
          Carrito
          <v-badge color="error" :content="cart.items.length"  v-if="cart.items.length !== 0" floating class="mb-3">
          </v-badge>
        </Link>
    </nav>
  </header>
</template>

<style >


</style>
