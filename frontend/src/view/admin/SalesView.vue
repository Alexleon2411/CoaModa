<script setup>
  import VueTailwindDatepicker from "vue-tailwind-datepicker";
  import { ref, computed, onMounted, watch } from 'vue';
  import { useSalesStore } from "../../stores/sales";
  import SalesDetails from "../../components/SalesDetails.vue";
  import { formatCurrency } from "../../helpers";
  import { useRoute, useRouter } from "vue-router";
  import { useCartStore } from "../../stores/cart";

  const route = useRoute()
  const router = useRouter()
  const cart = useCartStore()

  const sales = useSalesStore()
  const formatter = ref({
    date: 'DD/MM/YYYY',
    month: 'MMMM'
  })
  const search = ref({
    'tlf': '',
    'status': ''

  })

  const telefono = computed(() =>  search.value.tlf)
  const status = computed(() => search.value.status);

  const buscarVentas = () => {
    sales.telefono = telefono.value;
    sales.status = status.value;
    router.push({ path: '/admin/ventas', query: { tlf: telefono.value } });
  };

  onMounted(() => {
    const tlfFromQuery = route.query.tlf;
    if (tlfFromQuery) {
      search.value.tlf = tlfFromQuery;
      sales.telefono = tlfFromQuery;
    }
  });

// Observa cambios en el número de teléfono para realizar la búsqueda
  watch(telefono, (newVal) => {
    if (newVal) {
      sales.telefono = newVal; // Actualiza el store de ventas
      // Opcional: Puedes navegar a una ruta específica si se desea
      // router.push({ path: `/admin/ventas/${newVal}` });
    }
  });

</script>
<template>
  <h1 class="text-4xl font-bacl my-10"></h1>
  <div class="md:flex md:items-start gap-5">
    <div class="md:w-1/2 lg:w-1/3  flex justify-center ">
      <VueTailwindDatepicker
        as-single
        no-input
        v-model="sales.date"
        :formatter="formatter"
        />
    </div>
    <div class="md:w-1/2 lg:w-2/3 space-y-5 lg:h-screen lg:overflow-y-scroll p5 pb-32">
      <p class="text-center text-lg font-black" v-if="sales.isDateSelected || sales.isPhoneSelected">
        Ventas {{ sales.isDateSelected ? `de la fecha: ${sales.date}` : '' }} {{ sales.isPhoneSelected ? `del teléfono: ${sales.telefono}` : '' }}
      </p>

      <p class="text-center text-lg" v-else>
        Selecciona una fecha o introduce un número de teléfono
      </p>
      <div>
        <v-row>
          <v-col>
            <v-text-field
              v-model="sales.telefono"
              label="Buscar por Teléfono"
              placeholder="Ingresa el número de teléfono"
              clearable
            ></v-text-field>
          </v-col>
          <v-col>
            <v-select
              :items="['pendiente', 'realizada', 'cancelada']"
              label="Estado de la Venta"
              v-model="sales.status"
              @change="buscarVentas"
              clearable
            ></v-select>
          </v-col>
        </v-row>
     </div>
      <div class="space-y-5" v-if="sales.salesCollection.length">
        <SalesDetails
          v-for="sale in sales.salesCollection"
          :key="sale.id"
          :sale="sale"
          @update-status="cart.updateSaleStatus(sale.id, $event)"
        />
        <p class="text-right text-2xl bg-gray-300 pr-2"> Total  de ventas del dia:

          <span class="font-black"> {{ formatCurrency(sales.totalSalesOfDay) }}</span>
        </p>
      </div>
      <p v-else-if="sales.noSales" class="text-lg text-center font-black">No hay ventas disponibles para los criterios seleccionados</p>
    </div>

  </div>
</template>
