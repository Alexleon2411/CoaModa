
<script setup>
import { reactive } from 'vue';
import Link from '../../components/Link.vue';
import useImage from '../../composables/useImage'
import { useProductStore }from '../../stores/products'
import {  useRouter } from 'vue-router';

//la manera de extraer los composables es la siguiente
  const router = useRouter()
  const { url, onFileChange, isImageUploaded } = useImage()
  const products = useProductStore()
  const formData = reactive({
    name: '',
    category: '',
    price: '',
    availability: '',
    image: '',
  })

  const submitHandler = async data => {
    const { image, ...values } =  data // data es un valor por defecto que retorna la funcion
    try {
      await products.createProduct({
        ...values,
        image: url.value
      })
      router.push({name: 'products'})
    } catch (error) {
      console.log(error)
    }
  }
</script>
<template>
  <div>
    <Link to="products">Volver</Link>
    <h1 class="text-4xl font-black my-10"> Nuevo Producto</h1>
    <div class="flex justify-center bg-white shadow">
      <!-- la clase w-full para que tome todo el ancho la clase de 2x:w-2/4  es el media querie que toma 2 de 4 columnas-->
      <div class="mt-10 p-10 w-full 2xl:w-2/4">

        <FormKit
          type="form"
          submit-label="Agregar Producto"
          incomplete-message="No se pudo crear el producto"
          @submit="submitHandler"
          :value="formData"
        >
        <FormKit
          type="text"
          label="Nombre"
          name="name"
          placeholder="Nombre Del producto"
          validation="required"
          :validation-messages="{required: 'El nombre del producto es obligatorio'}"
          v-model.trim="formData.name"
        />
        <FormKit
          type="file"
          label="imagen del Producto"
          name="image"
          validation="required"
          :validation-messages="{required: 'La imagen del producto es obligatoria'}"
          accept=".jpg"
          multiple="true"
          @change="onFileChange"
          v-model.trim="formData.image"
        />
        <div v-if="isImageUploaded">
          <p class="font-black">Imagen producto: </p>
          <img :src="url" alt="Nueva imagen producto" class="w-32">
        </div>
        <FormKit
          type="select"
          label="Categoria"
          name="category"
          validation="required"
          :validation-messages="{required: 'La Categoria del producto es obligatorio'}"
          :options="products.categoryOptions"
          v-model.number="formData.category"
        />
        <FormKit
          type="number"
          label="precio"
          name="price"
          placeholder="precio del producto"
          validation="required"
          :validation-messages="{required: 'El precio del producto es obligatorio'}"
          min="1"
          v-model.number="formData.price"
        />
        <FormKit
          type="number"
          label="disponibles"
          name="availability"
          placeholder="Cantidad disponible"
          validation="required"
          :validation-messages="{required: 'La Cantidad  del producto es obligatoria'}"
          min="1"
          v-model.number="formData.availability"
        />
      </FormKit>
    </div>
  </div>
  </div>
</template>
