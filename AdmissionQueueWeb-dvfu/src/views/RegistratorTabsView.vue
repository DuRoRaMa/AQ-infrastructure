<script setup lang="ts">
import PanelTab from './RegistratorTabs/PanelTab.vue';
import InProgressTab from './RegistratorTabs/InProgressTab.vue';
import InQueueTab from './RegistratorTabs/InQueueTab.vue';
import HistoryTab from './RegistratorTabs/HistoryTab.vue';
import { ref, getCurrentInstance } from 'vue';
import { useAuth } from 'vue-auth3';

const tab = ref('Panel');
const baseTabs = [
  {
    id: 'Panel',
    label: 'Панель',
    icon: 'home',
    component: PanelTab
  },
  {
    id: 'InProgress',
    label: 'В обработке',
    icon: 'sync',
    component: InProgressTab
  },
  {
    id: 'Queue',
    label: 'Очередь',
    icon: 'human-queue',
    component: InQueueTab
  },
  {
    id: 'History',
    label: 'История',
    icon: 'history',
    component: HistoryTab
  }
];
const auth = useAuth();
const $buefy = getCurrentInstance()?.appContext.config.globalProperties.$buefy;
</script>
<template>
  <b-tabs type="is-boxed" v-model="tab">
    <b-tab-item
      v-for="item in baseTabs"
      :key="item.id"
      :value="item.id"
      :icon="item.icon"
      :label="item.label"
    >
      <component :is="item.component"></component>
    </b-tab-item>
  </b-tabs>
</template>
