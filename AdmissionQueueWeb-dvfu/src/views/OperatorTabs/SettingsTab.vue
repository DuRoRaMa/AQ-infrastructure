<script setup lang="ts">
import { getAPIData, patchAPIData } from '@/axios';
import { type OperatorLocation, type TalonPurpose } from '@/types';
import { computed, getCurrentInstance, onMounted, reactive, ref } from 'vue';
import { useAuth } from 'vue-auth3';

const auth = useAuth();
const $buefy = getCurrentInstance()?.appContext.config.globalProperties.$buefy;
let info = reactive({
  purposes: [] as TalonPurpose[],
  locations: [] as OperatorLocation[]
});
let currentState = reactive({
  purposes: [] as number[],
  location: -1,
  automatic_assignment: false
});
let loadingSave = ref(false);
const dataLength = computed(() => {
  return info.locations.length != 0;
});
onMounted(() => {
  console.log('Settings loaded');
  getAPIData(
    '/queue/operator/settings',
    auth,
    (response) => {
      Object.assign(currentState, response.data);
      getAPIData(
        '/queue/info',
        auth,
        (response) => {
          Object.assign(info, response.data);
          for (let loc_i in info.locations) {
            if (
              info.locations[loc_i].settings !== null &&
              currentState.location !== info.locations[loc_i].id
            ) {
              info.locations[loc_i].disabled = true;
            } else {
              info.locations[loc_i].disabled = false;
            }
          }
        },
        (error) => {
          $buefy.toast.open({
            message: error
          });
        }
      );
    },
    (error) => {
      $buefy.toast.open({
        message: error
      });
    }
  );
});
function saveSettings() {
  loadingSave.value = true;
  patchAPIData(`/queue/operator/settings/`, currentState, auth, () => {
    loadingSave.value = false;
    $buefy.notification.open({
      message: `Настройки оператора успешно сохранены`,
      duration: 5000,
      type: 'is-success',
      pauseOnHover: true
    });
  });
}
</script>
<template>
  <section class="hero is-medium container">
    <div class="hero-body">
      <div class="columns">
        <div class="column is-one-quarter"></div>
        <div class="column">
          <b-field label="Рабочее место">
            <b-select v-if="dataLength" v-model="currentState.location" placeholder="Выберите">
              <option :value="null" :key="0">Освободить рабочее место</option>
              <option
                v-for="option in info.locations"
                :value="option.id"
                :key="option.id.toString()"
                :disabled="option.disabled"
              >
                {{ option.name }}
              </option>
            </b-select>
            <b-skeleton v-else :animated="true"></b-skeleton>
          </b-field>
          <!-- <b-switch v-model="currentState.automatic_assignment">Автоматическое назначение</b-switch> -->
          <div class="block">
            <b-checkbox
              v-model="currentState.purposes"
              v-for="box in info.purposes"
              v-bind:key="box.id"
              v-bind:native-value="box.id"
            >
              {{ box.name }}
            </b-checkbox>
          </div>
          <div class="buttons">
            <b-button @click="saveSettings" :loading="loadingSave">Сохранить</b-button>
          </div>
        </div>
        <div class="column is-one-quarter"></div>
      </div>
    </div>
  </section>
</template>
<style>
option:disabled {
  background-color: grey;
}
</style>
