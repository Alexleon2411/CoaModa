<script setup>
  import { watch, reactive } from 'vue'
  import { useRoute, useRouter  } from 'vue-router'
  import {  doc  } from 'firebase/firestore'
  import { useFirestore, useDocument } from 'vuefire'
  import Link from '../../components/Link.vue';
  import { useProductStore } from '../../stores/products';
  import useImage from '../../composables/useImage'

/// consultar la url
  const route = useRoute()
  const router = useRouter()

  // nos conectamos a la base de datos
  const db = useFirestore()

  // creamos la varible que v aa consultar el documentom a esta variable se le pasa la base de datos el nombre de la columna donde se encuentra el documento  y por ultimo le pasamos el id del producto
  const docRef = doc(db, 'products', route.params.id )
  // aqui manejamos vuefire para hacer la peticion correcta a la base de datos
  const product = useDocument(docRef)



  const { onFileChange,  url, isImageUploaded } = useImage()
  const products = useProductStore()


  const formData = reactive({
      name: '',
      category: '',
      price: '',
      availability: '',
      image: ''
  })
  const submitHandler = async data => {
    try {
      await products.updateProduct(docRef, {...data, url})
      router.push({name: 'products'})
    } catch (error) {
      console.log(error)
    }
  }

  // con el watcher se puede ver los cambios que estan en el object product y se le dan como valor a los schemas de formData
  // estos datos de product vienen desde la url de la pagina, usando router.
  watch(product, (product) => {
    if(!product) {
      router.push({name: 'products'})
    }
    Object.assign((formData), product)
  })

</script>

<template>
    <div class="mt-10">
        <Link
            to="products"
        >
            Volver
        </Link>
            <h1 class="text-4xl my-10 font-extrabold">Editar Producto</h1>

            <div class="flex justify-center bg-white shadow">
            <div class="mx-auto mt-10 p-10 w-full  2xl:w-2/4">

                <FormKit
                    type="form"
                    :value="formData"
                    submit-label="Guardar Cambios"
                    incomplete-message="No se pudo enviar, revisa los mensajes"
                    @submit="submitHandler"
                    :actions="false"
                >
                    <FormKit
                        type="text"
                        label="Nombre"
                        name="name"
                        placeholder="Nombre de Producto"
                        validation="required"
                        v-model.trim="formData.name"
                        :validation-messages="{ required: 'El Nombre del Producto es Obligatorio' }"
                    />

                    <FormKit
                        type="select"
                        label="Categoría"
                        name="category"
                        validation="required"
                        v-model.number="formData.category"
                        :validation-messages="{ required: 'La Categoría es Obligatoria' }"
                        :options="products.categoryOptions"
                    />

                    <FormKit
                        type="number"
                        label="Precio"
                        name="price"
                        placeholder="Precio de Producto"
                        step="1"
                        min="1"
                        v-model.number="formData.price"
                    />

                    <FormKit
                        type="number"
                        label="Disponibles"
                        name="availability"
                        placeholder="Productos Disponibles"
                        v-model.number="formData.availability"
                        step="1"
                        min="0"
                    />

                    <div v-if="isImageUploaded">
                        <p class="font-black">Imagen Nueva:</p>
                        <img
                          :src="url"
                          alt="Nueva imagen Producto"
                          class="w-52"
                        />
                    </div>

                    <div v-else>
                        <p class="font-black">Imagen Actual:</p>
                        <img
                          :src="formData.image"
                          :alt="'Imagen de' + formData.image"
                          class="w-52"
                        />
                    </div>


                    <FormKit
                        type="file"
                        label="Cambiar Imagen"
                        name="image"
                        multiple="false"
                        accept=".jpg"
                        @change="onFileChange"
                    />


                    <FormKit
                        type="submit"
                    >Guardar Cambios</FormKit>

                </FormKit>
            </div>
        </div>
        </div>
</template>
