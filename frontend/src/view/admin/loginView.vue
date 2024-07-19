<script setup>
  import AdminNav from '../../components/AdminNav.vue'
  import { useForm, useField } from 'vee-validate'
  import { loginSchema as validationSchema } from '../../validation/loginSchema';
  import { useAuthStore } from '../../stores/auth';
  import { ref } from 'vue';

  const { handleSubmit } = useForm({ validationSchema  })
  const email = useField('email')
  const password = useField('password')
  const auth = useAuthStore()
  const alert = ref(false)

  const submit = handleSubmit((values) => {
    auth.login(values)
    if (auth.hasError) {
      alert.value = true
      setTimeout(() => {
        alert.value = false
      }, 3000);
    }
  })
</script>

<template>
  <AdminNav/>
  <div class="w-full h-screen flex items-center justify-center ">
    <v-card
        class="font-weight-bold  bg-blue-100 card"
        flat
      >
        <v-cart-title tag="h1" class="flex justify-center bg-blue-100 h-12 align-center">Inicio De Sesion</v-cart-title>
        <v-alert
          v-if="alert"
          class="my-5"
          :title="auth.hasError"
          type="error"
        ></v-alert>

        <v-form class="mt-5">
          <v-text-field
            label="email"
            bg-color="blue-grey-lighten-5"
            v-model="email.value.value"
            :error-messages="email.errorMessage.value"
            class="mb-3"
            >
          </v-text-field>
          <v-text-field
            label="Password"
            type="password"
            bg-color="blue-grey-lighten-5"
            v-model="password.value.value"
            :error-messages="password.errorMessage.value"
            class="mb-3"
            >
          </v-text-field>

          <v-btn
            block
            color="green-accent-4"
            @click="submit"
          >Iniciar Sesion </v-btn>
        </v-form>
    </v-card>
  </div>
</template>

<style scoped>
.card {
  width: 100% !important;
  border: 2px solid black;
  padding: 5px;
}

/* Media query para pantallas pequeñas (hasta 576px) */
@media (max-width: 576px) {
  .card {
    width: 100% !important;
  }
}

/* Media query para pantallas medianas (576px - 768px) */
@media (min-width: 576px) and (max-width: 768px) {
  .card {
    width: 75% !important;
  }
}

/* Media query para pantallas grandes (768px - 992px) */
@media (min-width: 768px) and (max-width: 992px) {
  .card {
    width: 50% !important;
  }
}

/* Media query para pantallas extra grandes (mayores de 992px) */
@media (min-width: 992px) {
  .card {
    width: 40% !important; /* o cualquier otro valor según tus necesidades */
  }
}
</style>
