import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useFirestore, useCollection, useFirebaseStorage } from 'vuefire' // esto me permite conectarme a la store de firebase, useCollection nos permite que los resultados que tengamos de firestore los podamos colocar en el state
import { collection, addDoc, where, query, limit, orderBy, updateDoc, doc, getDoc, deleteDoc } from 'firebase/firestore' // para obtener los datos creados y para crear un documento nuevo
import { use } from '@formkit/core'
import {ref as storageRef, deleteObject} from 'firebase/storage'

export const useProductStore = defineStore('product', () => {

  const db = useFirestore()
  const storage = useFirebaseStorage()

const selectCategory = ref(1)
  const categories = [
    {id: 1, name: 'Sudaderas'},
    {id: 2, name: 'Tenis'},
    {id: 3, name: 'Lentes'},
  ]

  // aqui se van a ejecutar los querys para los fetch de los productos desde la base de datos
  const q = query(
    collection(db, 'products'),
    /* where('pravaice', ">", 50) */
  )
  const productsCollection = useCollection(q);

  async function createProduct(product) {
    try {
      await addDoc(collection( db, 'products'), product)
      console.log('producto creado correctamente')
    } catch (error) {
      console.log(error, product)
    }
  }

  async function updateProduct(docRef, product) {
    const {image, url, ...values} = product
    if(image.length) {
      await updateDoc(docRef, {
        ...values,
        image: url.value
      })
    }else {
      await updateDoc(docRef, values)
    }
  }

  async function deleteProduct(id) {
    if(confirm('Quieres eliminar este producto?')) {
      //la siguiente configuracion es para eliminar el producto de la base de datos, el doc que usamos es para hacer referencia a el producto defirebase
      const docRef = doc(db, 'products', id)
      const docSnap = await getDoc(docRef) /// aqui identificamos el documento que esta relacionado con la imagen que tiene el mismo documento
      const {image} = docSnap.data() // distroction se aplica colocando el item del producto que querems de esta manera solo tomaremos el item y no el objeto entero
      // image ref es para obtener la referencia de la imagen y poder eliminarla
      const imageRef = storageRef(storage, image)
      await Promise.all([
        // deleteDoc es para eliminar el objecto de la base de datos
        deleteDoc(docRef),
        // deleteObject es para eliminar la imagen de la storage de firebase
        deleteObject(imageRef)
      ])
    }
  }

  const categoryOptions = computed(() => {
    const options = [
      {label: 'selecciones', value: '', attrs: {disabled: true}},
      ...categories.map(category => (
        {label: category.name, value: category.id}
      ))
    ]
    return options
  })

    // la siguiente funcion es para notificar que no tenemos ningun resultado obtenido desde la base de datos
    const noResults = computed(() => productsCollection.value.length === 0)

    const filteredProducts = computed(() => {
      return productsCollection.value
        .filter( product => product.category === selectCategory.value)
        .filter( product => product.availability > 0)
    })

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    productsCollection,
    categories,
    selectCategory,
    categoryOptions,
    noResults,
    filteredProducts
  }
})
