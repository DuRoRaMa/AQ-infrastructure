<script setup lang="ts">
import { getAPIData, postAPIData } from '@/axios';
import { getCurrentInstance, onMounted, reactive, ref } from 'vue';
import type { Auth } from 'vue-auth3';

interface Helper {
  id: number;
  sector: string;
  user: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
  };
}
interface Theme {
  id: number;
  name: string;
  description: string;
}
interface Info {
  themes: Theme[];
  helpers: Helper[];
}
const { auth } = defineProps({
  auth: {
    type: Object as () => Auth,
    required: true
  }
});
const priorities = [
  { id: 'Low', name: 'Низкий' },
  { id: 'Medium', name: 'Средний' },
  { id: 'High', name: 'Высокий' }
];
const info = ref<Info>({} as Info);
const currentState = reactive({ helper: null, theme: null, priority: null, text: '' });
const $buefy = getCurrentInstance()?.appContext.config.globalProperties.$buefy;
// const $emit = getCurrentInstance()?.appContext.config.globalProperties.$emit
onMounted(() => {
  getAPIData(
    '/helper/info',
    auth,
    (response) => {
      info.value = response.data;
    },
    (error) => {
      $buefy.toast.open({
        message: error
      });
    }
  );
});
function validateHelpRequest() {
  if (currentState.helper == null) {
    $buefy.toast.open({
      message: 'Выберите старшего',
      type: 'is-danger'
    });
    return false;
  }
  if (currentState.priority == null) {
    $buefy.toast.open({
      message: 'Выберите срочность',
      type: 'is-danger'
    });
    return false;
  }
  if (currentState.theme == null) {
    $buefy.toast.open({
      message: 'Выберите тему',
      type: 'is-danger'
    });
    return false;
  }
  return true;
}
function sendHelpRequest() {
  if (!validateHelpRequest()) return false;
  postAPIData('/helper/request', currentState, auth, (response) => {
    $buefy.notification.open({
      message: `Запрос отправлен!`,
      duration: 5000,
      type: 'is-success',
      pauseOnHover: true
    });
  });
  return true;
}
</script>

<template>
  <form action="">
    <div class="modal-card" style="min-width: 200px">
      <header class="modal-card-head">
        <p class="modal-card-title">Помощь</p>
      </header>
      <section class="modal-card-body">
        <div class="columns">
          <div class="column">
            <b-field label="Старший">
              <b-select
                placeholder="Выберите старшего"
                v-model="currentState.helper"
                :loading="!info.helpers"
              >
                <option
                  v-for="helper in info.helpers"
                  :value="helper.id"
                  :key="helper.id.toString()"
                >
                  {{ helper.user.first_name + ' ' + helper.user.last_name + ' - ' + helper.sector }}
                </option>
              </b-select>
            </b-field>
            <b-field label="Тема">
              <b-select
                placeholder="Выберите тему"
                v-model="currentState.theme"
                :loading="!info.themes"
              >
                <option v-for="theme in info.themes" :value="theme.id" :key="theme.id.toString()">
                  {{ theme.name }}
                </option>
              </b-select>
            </b-field>
          </div>
          <div class="column">
            <b-field label="Срочность">
              <b-select placeholder="Выберите срочность" v-model="currentState.priority">
                <option
                  v-for="priority in priorities"
                  :value="priority.id"
                  :key="priority.id.toString"
                >
                  {{ priority.name }}
                </option>
              </b-select>
            </b-field>
          </div>
        </div>
        <b-field label="Комментарий">
          <b-input v-model="currentState.text" maxlength="200" type="textarea"></b-input>
        </b-field>
      </section>
      <footer class="modal-card-foot">
        <b-button label="Закрыть" @click="$emit('close')" />
        <b-button
          label="Отправить"
          type="is-primary"
          @click="sendHelpRequest() ? $emit('close') : null"
          :loading="!info.helpers"
        />
      </footer>
    </div>
  </form>
</template>
<style lang=""></style>
