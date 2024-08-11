<script setup>
import { ref } from 'vue'
import { useCartStore } from '../stores/cart';
import Link from '../components/Link.vue'
import axios from 'axios';
import { useRouter } from 'vue-router';

const cart = useCartStore()
const name = ref('')
const email = ref('')
const tlf = ref('')
const router = useRouter()

const submitInfo = async (name, email, tlf) => {
  console.log(name)
  console.log(email)
  console.log(tlf)
  console.log(cart.items)

  try {
    const response = await axios.post('http://localhost:8080/send-email', {
      name: name,
      email: email,
      phone: tlf,
      cart: cart.items,
    });
    console.log(cart.checkout)
    router.push({name: 'shop'})
  } catch (error) {
  console.log(error)
  }
}
</script>
<template>
  <div class=" d-flex justify-center align-center" style="min-height: 100vh;">

    <div  class="w-50">
      <Link to="cart" style="max-width: 70px;">Volver</Link>
      <p class="mt-5 justify-center d-flex mb-4 ">Por Favor introduzca su informacion de contacto</p>
      <v-form>
        <v-row>
          <v-col cols="6" md="6" sm="12">
            <v-text-field label="Name" v-model="name">
            </v-text-field>
          </v-col>
          <v-col cols="6" md="6" sm="12">
            <v-text-field label="Email" v-model="email">
            </v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field label="Numero de Telefono" v-model="tlf">
            </v-text-field>
          </v-col>
          <v-col cols="12">
              <v-btn @click="submitInfo(name, email, tlf)" class="bg-gray-500 mr-3">Realizar pedido</v-btn>
              <v-btn @click="cart.checkout" >check out   </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </div>
    </div>
</template>
