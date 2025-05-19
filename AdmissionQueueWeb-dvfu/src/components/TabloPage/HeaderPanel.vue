<script setup lang="ts">
import { computed, reactive } from 'vue';
import { useTime } from 'vue-timer-hook';

const time = useTime('24-hour');
const hours = computed(() => {
  return time.hours.value.toLocaleString('ru-ru', { minimumIntegerDigits: 2 });
});
const minutes = computed(() => {
  return time.minutes.value.toLocaleString('ru-ru', { minimumIntegerDigits: 2 });
});
let date = reactive(new Date());
date.toDateString();
setInterval(() => {
  date = new Date();
}, 60000);
</script>
<template>
  <div class="columns" style="padding-top: 6px">
    <div class="column is-one-quarter">
      <p style="color: #58595b; margin-left: 40px; font-family: Unbounded-Medium">
        {{
          date.toLocaleDateString('ru-ru', { day: '2-digit', month: '2-digit', year: '2-digit' })
        }}
      </p>
    </div>
    <div class="column auto">
      <p class="has-text-centered" style="font-family: 'Unbounded-Bold'">Приёмная комиссия</p>
    </div>
    <div class="column is-one-quarter">
      <div class="columns">
        <div class="column"></div>
        <div class="column is-half">
          <p
            class="has-text-left"
            style="color: #58595b; padding-left: 25px; font-family: Unbounded-Medium"
          >
            {{ hours }}:{{ minutes }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
p {
  font-size: 26px;
  color: #1d3d84;
}
</style>
