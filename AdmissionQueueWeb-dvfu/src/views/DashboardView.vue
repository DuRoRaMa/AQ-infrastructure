<script setup lang="ts">
import { getAPIData } from '@/axios';
import TotalTalonPurposes from '@/components/DashboardPage/TotalTalonsPurposes.vue';
import RatingOperatorByTalonPurposes from '@/components/DashboardPage/RatingOperatorByTalonPurposes.vue';
import { getCurrentInstance, onMounted, reactive, ref, watch } from 'vue';
import { useAuth } from 'vue-auth3';
const $buefy = getCurrentInstance()?.appContext.config.globalProperties.$buefy;
const auth = useAuth();
const data = reactive({});
const dates = ref([new Date(), new Date()]);
const needUpdate = ref(false);
function update() {
  let d1: Date = new Date(dates.value[0].getTime());
  let d2: Date = new Date(dates.value[1].getTime());
  d1.setHours(0, 0, 0, 0);
  d2.setHours(23, 59, 59, 999);
  getAPIData(
    '/queue/dashboard',
    auth,
    (response) => {
      Object.assign(data, response.data);
    },
    (error) => {
      $buefy.toast.open({
        message: error
      });
    },
    {
      start: d1,
      end: d2
    }
  );
  needUpdate.value = false;
}
onMounted(() => {
  update();
  watch(needUpdate, (newValue, oldValue) => {
    if (newValue) {
      update();
    }
  });
});
</script>
<template>
  <b-field label="Выберите дату">
    <b-datepicker
      placeholder="Нажмите, чтобы выбрать"
      v-model="dates"
      @range-end="
        (date: Date) => {
          needUpdate = true;
          return date;
        }
      "
      range
    />
  </b-field>
  <TotalTalonPurposes :data="data.totalTalonPurposes" :talon_purposes="data.TalonPurposes" />
  <RatingOperatorByTalonPurposes :data="data.ratingOperatorByTalonPurposes" />
</template>
