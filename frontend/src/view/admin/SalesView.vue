<script setup>
  import VueTailwindDatepicker from "vue-tailwind-datepicker";
  import { ref } from 'vue';
  import { useSalesStore } from "../../stores/sales";
  import SalesDetails from "../../components/SalesDetails.vue";

  const sales = useSalesStore()
  const formatter = ref({
    date: 'DD/MM/YY',
    month: 'MMMM'
  })
   const gettingDB = async data => {
    try {
      console.log(sales.salesSource);
      console.log(sales.salesCollection);
      console.log(sales.date);
    } catch (error) {
      console.error (error);
    }
   }
  console.log(sales.salesCollection)
  console.log(sales.isDateSelected)
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
      <p
        class="text-center text-lg"
        v-if="sales.isDateSelected"
      >
        Ventas de la fecha:
        <span class="font-black">
          {{ sales.date }}
        </span>
      </p>

      <p class="text-center text-lg" v-else>
        Selecciona una fecha
      </p>
      <div class="space-y-5">
        <SalesDetails
          v-for="sale in sales.salesCollection"
          :key="sale.id"
          :sale="sale"
        />
      </div>
    </div>

  </div>
</template>
