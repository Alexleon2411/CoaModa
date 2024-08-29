import { defineStore } from "pinia";
import { ref, computed, watchEffect } from "vue";
import { useCouponStore } from './coupons'
import { collection, addDoc, runTransaction, doc, getDocs, updateDoc } from 'firebase/firestore'
import { useFirestore } from 'vuefire'
import { getCurrentDate } from '../helpers'
import { useRouter } from "vue-router";
import axios from 'axios';


export const useCartStore = defineStore('cart', () => {
  const db = useFirestore()
  const router = useRouter()

  const coupon = useCouponStore()
  const user  = ref({
    'userName': '',
    'email': '',
    'tlf': ''
  })
  const items = ref([])
  const subTotal = ref(0)
  const MAX_PRODUCT = 5;
  const taxes = ref(0)
  // para calcular el rango de taxes
  const TAX_RATE = .10
  const total = ref(0)
  const status = ref('pendiente')

  //aqui se observa los cambios echos en la cantidad y se multiplica por el precio del producto
    /* cuando se usa un watch effect no se le debe pasar ninguna dependencia ya que todo lo que esta registrado es en parte
       la dependencia de watcheffect
    */
  watchEffect( () => {
    subTotal.value = items.value.reduce((total, item) => total + (item.quantity * item.price), 0)
    taxes.value = Number((subTotal.value * TAX_RATE).toFixed(2)) // esto hace que el resultado de la multiplicacion nos devuelva solo dos decimales y luego se convierta a numero
    total.value = Number(((subTotal.value + taxes.value) - coupon.discount).toFixed(2))
  })

  function addItem(item) {
    // se agrega el id de forma individual porque al aplicar destroctoring se pierde el id een el item
    const index = isItemInCart(item.id)
    if (index >= 0) {
      if(isProductAvailable( item, index)) {
        alert('has alcanzado el limite')
        return
      }
      // aqui se debe actualizar la cantidad de uno a uno

      items.value[index].quantity++
    }else {
      items.value.push({...item, quantity: 1, id: item.id})
    }
  }

  const isEmpty = computed(() => items.value.length === 0)

  //a updatequiamtity se le pasa el id para saber que item en especifico se le esta cambiando la cantidad
  function updateQuantity(id, quantity) {
    // aqui le damos el valor a item i el id del item que estamos iterando es igual al item que obtenemos.. si es asi se le pasa una compia del item
    // pero con la cantidad que ha solicitado el usuario. de lo contrario solo de le pasa la misma referencia del item que estamos iterando para no perder la referencia del producto
    items.value =  items.value.map(item => item.id ? {...item, quantity} : item)
  }

  function removeItem(id) {
    items.value = items.value.filter(item => item.id !== id)
  }

  async function handleShop(){
     await sendEmail()
     await checkout()
     await sendWhatsapp()
    console.log('connected')
  }

  async function sendEmail()  {

    try {
      const response = await axios.post('/send-email', {
        name: user.value.userName,
        email: user.value.email,
        phone: user.value.tlf,
        cart: items.value,
      });
    } catch (error) {
    console.log(error)
    }
  }

  /* async function sendWhatsaap() {
    try {
      const response = await axios.post('/realizar-compra', {
        cliente: user.value.userName,
        total: total.value,
        tlf: user.value.tlf,
        articulos: items.value,
      });
    } catch (error) {
    console.log(error)
    }
  } */
    async function sendWhatsapp() {
      try {
        const number = '32467705169'
        const message = `
          Hola, soy ${user.value.userName}.
          Quiero realizar un pedido con los siguientes artículos:
          articulos: ${items.value}
          Subtotal: ${subTotal.value}€
          Impuestos: ${taxes.value}€
          Descuento: ${coupon.discount}€
          Total a pagar: ${total.value}€
          URL: https://buhu-coa.vercel.app/admin/ventas?tlf=${user.value.tlf}
        `;

        const whatsappLink = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

        // Redirigir al usuario a WhatsApp con el mensaje prellenado
        window.open(whatsappLink, '_blank');
      } catch (error) {
        console.log(error);
      }
    }

  async function checkout() {
    try {
        await addDoc(collection(db, 'sales'), {
        items: items.value.map(item => {
          const { availability, category, ...data } = item
          return data
        }),
        subTotal: subTotal.value,
        taxes: taxes.value,
        discount: coupon.discount,
        total: total.value,
        date: getCurrentDate(),
        user: user.value,
        status: status.value,
      })
      //substraer la cantidad de lo disponible
      items.value.forEach(async(item) => {
        const productRef = doc(db, 'products', item.id) //encontramos en la base de dato el producto con el mismo id
        await runTransaction(db, async (transaction) => { //ejecutamos la function runtransaction para ejecutar la transacion que queremos ejecutar
          const currentProduct = await transaction.get(productRef) // aqui solicitamos la transacion que queremos ejecutar con la referencia del producto como argumento
          const availability = currentProduct.data().availability - item.quantity /// aqui ejecutamos la transacion que queremos ejecutar que es eliminar la disponibilidad que tiene el priducto con a cantidad que la transacion a ejecutado
          transaction.update(productRef, { availability }) // aqui se actualiza la base de datos pasandole como argumento la cantidad de productos restantes
        })
      })
      // reiniciar el state del carrito
      $reset()
      coupon.$reset()
      router.push({name: 'shop'})
      console.log('pedido hecho ')
    } catch (error) {
      console.log(error)
    }
  }

  function $reset() {
    items.value = []
    subTotal.value = 0
    taxes.value = 0
    total.value = 0
  }

  const isItemInCart = id => items.value.findIndex(item => item.id === id)

  const isProductAvailable = (item, index) => {
    return items.value[index].quantity >= item.availability || items.value[index].quantity >= MAX_PRODUCT
  }

  const checkProductAvailability = computed(() => {
    return (product) => product.availability < MAX_PRODUCT ? product.availability : MAX_PRODUCT
  })

  const updateSaleStatus = async (saleId, newStatus) => {
    const saleRef = doc(db, 'sales', saleId);
    const response = await updateDoc(saleRef, { status: newStatus });
    alert('Se ha actualizado el estado')
  };

  return {
    subTotal,
    taxes,
    total,
    addItem,
    handleShop,
    updateQuantity,
    removeItem,
    checkout,
    updateSaleStatus,
    isEmpty,
    user,
    items,
    checkProductAvailability
  }
})
