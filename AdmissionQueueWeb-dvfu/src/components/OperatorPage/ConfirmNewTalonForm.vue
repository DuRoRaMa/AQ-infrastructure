<script setup lang="ts">
import { getAPIData, postAPIData } from '@/axios';
import { getCurrentInstance, onMounted, reactive, ref } from 'vue';
import { type OperatorLocation, type TalonPurpose } from '@/types';
import type { Auth } from 'vue-auth3';
import { useOperatorTalonStore } from '@/stores/OperatorTalonStore';

const { auth } = defineProps({
  auth: {
    type: Object as () => Auth,
    required: true
  }
});
const operatorTalonStore = useOperatorTalonStore();
const currentState = reactive({ purpose: null as number | null });
const $buefy = getCurrentInstance()?.appContext.config.globalProperties.$buefy;
let info = reactive({
  purposes: [] as TalonPurpose[]
});
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
function createNewTalon() {
  postAPIData(
    '/queue/operator/talon/action',
    { purpose: currentState.purpose },
    auth,
    (response) => {
      if (response.status === 200) {
        operatorTalonStore.setCurrentTalonId(response.data.id);
        $buefy.notification.open({
          message: `Новый талон создан. Если информаци не обновилась, то обновите страницу`,
          duration: 5000,
          type: 'is-success',
          pauseOnHover: true
        });
      }
    },
    (error) => {
      $buefy.toast.open({
        message: error
      });
    },
    {
      action: 'new'
    }
  );
  return true;
}
</script>

<template>
  <form action="">
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Создание внепланового талона</p>
      </header>
      <section class="modal-card-body">
        <b-field label="Цель">
          <b-select placeholder="Выберите цель" v-model="currentState.purpose">
            <option v-for="purpose in info.purposes" :value="purpose.id" :key="purpose.id.toString">
              {{ purpose.name }}
            </option>
          </b-select>
        </b-field>
      </section>
      <footer class="modal-card-foot">
        <b-button label="Закрыть" @click="$emit('close')" />
        <b-button
          label="Отправить"
          type="is-primary"
          @click="createNewTalon() ? $emit('close') : null"
        />
      </footer>
    </div>
  </form>
</template>
<style lang=""></style>
