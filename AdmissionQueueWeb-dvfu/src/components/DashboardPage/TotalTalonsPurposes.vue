<script setup lang="ts">
import { reactive, watch } from 'vue';

const props = defineProps({ data: Array, talon_purposes: Array });
const series = reactive([] as number[]);
const labels = reactive([] as string[]);
const chartOptions = {
  chart: {
    type: 'pie'
  },
  labels: labels,
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 300
        },
        legend: {
          position: 'bottom'
        }
      }
    }
  ],
  noData: { text: 'Нет данных' }
};
watch(props, () => {
  series.splice(0, series.length);
  labels.splice(0, labels.length);
  series.push(...props.data);
  labels.push(...props.talon_purposes);
});
</script>
<template>
  <apexchart type="pie" width="380" :options="chartOptions" :series="series" />
</template>
