import { defineStore } from "pinia";
import { ref, computed } from 'vue';
import { query, collection, where } from 'firebase/firestore'
import { useFirestore, useCollection } from 'vuefire'

export const useSalesStore = defineStore('sales', () => {

  const db = useFirestore()
  const date = ref('')
  const telefono = ref('')
  const status = ref('')


  const salesSource = computed(() => {
    const conditions = [];

    if (date.value) {
      conditions.push(where('date', '==', date.value));
    }
    if (telefono.value) {
      conditions.push(where('user.tlf', '==', telefono.value));
    }
    if (status.value) {
      conditions.push(where('status', '==', status.value)); // Filtro por estado
    }


    if (conditions.length) {
      const q = query(
        collection(db, 'sales'),
        ...conditions
      );
      return q;
    }

    return null;
  })
  // La colección de ventas se actualiza automáticamente
  const salesCollection = useCollection(salesSource)

  const isDateSelected = computed(() => date.value)
  const isPhoneSelected = computed(() => telefono.value);
  const isStatusSelected = computed(() => status.value);

  const noSales = computed(() => !salesCollection.length && date.value)

  const totalSalesOfDay = computed(() => {
    return salesCollection.value ? salesCollection.value.reduce((total, sale) => total + sale.total, 0) : 0
  })

  return {
    date,
    status,
    telefono,
    isDateSelected,
    isPhoneSelected,
    isStatusSelected,
    salesCollection,
    salesSource,
    noSales,
    totalSalesOfDay,
  }
})
