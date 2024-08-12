import { defineStore } from "pinia";
import { ref, computed } from 'vue';
import { query, collection, where } from 'firebase/firestore'
import { useFirestore, useCollection } from 'vuefire'

export const useSalesStore = defineStore('sales', () => {

  const db = useFirestore()
  const date = ref('')

  const salesSource = computed(() => {
    if(date.value) {
      const q = query(
        collection(db, 'sales'),
        where('date', '==', date.value)
      )
      return q
    }
  })
  //la siguiente funcion cambia su valor cada vez que el computed salesSource cambie sus datos
  const salesCollection = useCollection(salesSource)

  const isDateSelected = computed(() => date.value)

  const noSales = computed(() => !salesCollection.length && date.value)

  const totalSalesOfDay = computed(() => {
    return salesCollection.value ? salesCollection.value.reduce((total, sale) => total + sale.total, 0) : 0
  })

  return {
    date,
    isDateSelected,
    salesCollection,
    salesSource,
    noSales,
    totalSalesOfDay,
  }
})
