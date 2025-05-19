<script setup lang="ts">
import { getAPIData, postAPIData } from '@/axios';
import { computed, getCurrentInstance, onMounted, reactive, ref, watch } from 'vue';
import { useAuth } from 'vue-auth3';
import type { OperatorLocation, TalonPurpose } from '@/types';
import { useLazyQuery } from '@vue/apollo-composable';
import { GET_TALON_BY_ID } from '@/queries';

const auth = useAuth();
const $buefy = getCurrentInstance()?.appContext.config.globalProperties.$buefy;
let loadingRegister = ref(false);
const currentState = reactive({ purpose: null as number | null, comment: '' });
const info = reactive({
  purposes: [] as TalonPurpose[],
  locations: [] as OperatorLocation[]
});
let lastTalonId = ref(0);
let lastTalonById = ref({});
let talonById = useLazyQuery(GET_TALON_BY_ID, {}, { fetchPolicy: 'cache-and-network' });
talonById.onResult((res) => {
  if (res.loading) return null;
  lastTalonById.value = res.data;
});
watch(lastTalonId, async (newTalonId, _oldTalonId) => {
  if (newTalonId !== 0) {
    (await talonById.load(null, { id: newTalonId })) ||
      (await talonById.refetch({ id: newTalonId }));
    print();
  }
});
function print() {
  fetch('http://localhost:8001/', {
    method: 'POST',
    body: JSON.stringify(lastTalonById.value),
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json',
      Accept: '*/*',
      'Access-Control-Allow-Origin': '*'
    }
  })
    .catch((error) => {
      $buefy.notification.open({
        message: `Произошла ошибка при попытке печати талона. Проверьте принтер и сервер печати!`,
        duration: 5000,
        type: 'is-danger',
        pauseOnHover: true
      });
    })
    .then((response) => {
      if (response === undefined) {
        $buefy.notification.open({
          message: `Произошла ошибка при попытке печати талона. Проверьте принтер и сервер печати!`,
          duration: 5000,
          type: 'is-danger',
          pauseOnHover: true
        });
      } else {
        $buefy.notification.open({
          message: `Печать талона выполнена успешно`,
          duration: 3000,
          type: 'is-success',
          pauseOnHover: true
        });
      }
    });
}
const dataLength = computed(() => {
  return info.purposes.length != 0;
});
function validateRegTalon() {
  if (currentState.purpose == null) {
    $buefy.toast.open({
      message: 'Выберите цель',
      type: 'is-danger'
    });
    return false;
  }
  return true;
}
function registerTalon() {
  if (!validateRegTalon()) return;
  loadingRegister.value = true;
  postAPIData('/queue/talon/', currentState, auth, (response) => {
    loadingRegister.value = false;
    if (response.status === 201) {
      lastTalonId.value = response.data.id;
      $buefy.notification.open({
        message: `Талон успешно создан`,
        duration: 5000,
        type: 'is-success',
        pauseOnHover: true
      });
    } else {
      $buefy.notification.open({
        message: `Произошла ошибка при отправке запроса. Повторите позже или свяжитесь с администратором`,
        duration: 5000,
        type: 'is-error',
        pauseOnHover: true
      });
    }
  });
}
onMounted(() => {
  getAPIData(
    '/queue/info',
    auth,
    (response) => {
      Object.assign(info, response.data);
    },
    (error) => {
      $buefy.toast.open({
        message: error
      });
    }
  );
});
</script>
<template>
  <div class="hero is-medium container">
    <div class="hero-body">
      <div class="columns">
        <div class="column is-one-quarter"></div>
        <div class="column">
          <p class="title">Ресепшен</p>
          <b-field label="Цель">
            <div v-if="dataLength" class="buttons has-addons">
              <b-button
                v-for="option in info.purposes"
                :value="option.id"
                :key="option.id.toString()"
                @click="currentState.purpose = option.id"
                :class="{ 'is-primary': currentState.purpose == option.id }"
              >
                {{ option.name }}</b-button
              >
            </div>
            <b-skeleton v-else :animated="true"></b-skeleton>
          </b-field>
          <b-field label="Комментарий">
            <b-input v-model="currentState.comment" maxlength="200" type="textarea"></b-input>
          </b-field>
          <b-button @click="registerTalon" :loading="loadingRegister">Зарегистрировать</b-button>
        </div>
        <div class="column is-one-quarter"></div>
      </div>
    </div>
  </div>
</template>
