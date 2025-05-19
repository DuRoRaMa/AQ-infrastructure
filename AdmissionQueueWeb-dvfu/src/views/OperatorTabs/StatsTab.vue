<script setup lang="ts">
import { getAPIData } from '@/axios';
import { getCurrentInstance, reactive } from 'vue';
import { useAuth } from 'vue-auth3';

const $buefy = getCurrentInstance()?.appContext.config.globalProperties.$buefy;
const auth = useAuth();
const series = reactive([]);
const chartOptions = {
  chart: {
    id: 'area-count-purposes'
  },
  title: {
    text: 'Кол-во успешно обработанных талонов',
    align: 'center'
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    type: 'datetime',
    labels: {
      formatter: (value, timestamp) => {
        return new Date(timestamp).toLocaleDateString('ru-ru', { formatMatcher: 'best fit' });
      }
    }
    // min: new Date('19.06.2024').getTime()
  },
  markers: {
    size: 5
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.9,
      stops: [0, 100]
    }
  },
  noData: { text: 'Нет данных' }
};
function update() {
  getAPIData(
    '/queue/operator/stats',
    auth,
    (response) => {
      series.splice(0, series.length);
      Object.assign(series, response.data);
    },
    (error) => {
      $buefy.toast.open({
        message: error
      });
    }
  );
}
</script>
<template>
  <b-button @click="update()">Загрузить</b-button>
  <apexchart type="area" height="350" :options="chartOptions" :series="series" />
</template>
