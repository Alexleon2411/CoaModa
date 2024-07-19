import { defineStore } from "pinia";
import { ref, watch, computed } from "vue";
import { useCartStore } from "./cart";


export const useCouponStore = defineStore('coupon', () => {

  const cart = useCartStore()
  const couponInput = ref('')
  const couponMessage = ref('')
  const discountPercentage = ref(0)
  const discount = ref(0)


  const VALID_COUPONS = [
    {name: '10DESCUENTO', discount: .10},
    {name: '20DESCUENTO', discount: .20},
  ]

  watch(discountPercentage, () => {
    discount.value = (cart.total * discountPercentage.value).toFixed(2)
  })

  function applyCoupon() {
    // la siguiente condicion es para encontrar algun elemento dentro del aray de objecto donde el nombre sea igual al nombre del cupon ingrasado
    if (VALID_COUPONS.some(coupon => coupon.name === couponInput.value)) {
      couponMessage.value = 'Aplicando....'
      setTimeout(() => {
        discountPercentage.value = VALID_COUPONS.find(coupon => coupon.name === couponInput.value).discount
        couponMessage.value = '!Descuento Aplicado¡'
      }, 3000);
    }else {
      console.log('no existe ese coupon')
      couponMessage.value = 'no existe ese coupon'
    }
    setTimeout(() => {
      couponMessage.value = ''
    }, 6000);
  }

  function $reset() {
     couponInput.value = ''
     couponMessage.value = ''
     discountPercentage.value = 0
     discount.value = 0
  }

  const isValidCoupon = computed(() => discountPercentage.value > 0 )

  return {
    applyCoupon,
    $reset,
    couponInput,
    couponMessage,
    discount,
    isValidCoupon,
  }
})
