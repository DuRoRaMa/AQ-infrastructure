<script setup lang="ts">
import { computed, reactive, watch } from 'vue';

const props = defineProps({ data: Object });
const series = reactive([] as Object[]);
const labels = reactive([] as string[]);
const chartOptions = {
  chart: {
    type: 'bar',
    stacked: true
  },
  plotOptions: {
    bar: {
      horizontal: true
    }
  },
  xaxis: {
    categories: labels
  },
  // responsive: [
  //   {
  //     breakpoint: 480,
  //     options: {
  //       chart: {
  //         width: 300
  //       },
  //       legend: {
  //         position: 'bottom'
  //       }
  //     }
  //   }
  // ],
  noData: { text: 'Нет данных' }
};
const height = computed(() => {
  return 10 * labels.length;
});
watch(props, () => {
  series.splice(0, series.length);
  labels.splice(0, labels.length);
  series.push(...props.data.data);
  labels.push(...props.data.operator);
});
</script>
<template>
  <apexchart type="bar" height="400" width="400" :options="chartOptions" :series="series" />
</template>
