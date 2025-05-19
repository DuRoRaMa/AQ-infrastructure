<script setup lang="ts">
import { getAPIData } from '@/axios';
import OperatorPanelView from './OperatorTabs/PanelTab.vue';
import OperatorSettingsView from './OperatorTabs/SettingsTab.vue';
import OperatorStatsView from './OperatorTabs/StatsTab.vue';
import { ref, h, watch, getCurrentInstance } from 'vue';
import type { OperatorSettings } from '@/types';
import { useAuth } from 'vue-auth3';

const tab = ref('Settings');
const baseTabs = [
  {
    id: 'Panel',
    label: 'Панель',
    icon: 'home',
    component: OperatorPanelView
  },
  {
    id: 'Stats',
    label: 'Показатели',
    icon: 'chart-pie',
    component: OperatorStatsView
  },
  {
    id: 'Settings',
    label: 'Настройки',
    icon: 'cog',
    component: OperatorSettingsView
  }
];
const auth = useAuth();
const $buefy = getCurrentInstance()?.appContext.config.globalProperties.$buefy;
watch(tab, () => {
  if (tab.value == 'Panel') {
    getAPIData(
      '/queue/operator/settings',
      auth,
      (response) => {
        const currentSettings = response.data as OperatorSettings;
        if (currentSettings.location === null || currentSettings.purposes.length === 0) {
          $buefy.notification.open({
            message: `Настройки оператора должны быть заполнены`,
            duration: 5000,
            type: 'is-warning',
            pauseOnHover: true
          });
          tab.value = 'Settings';
        }
      },
      (error) => {
        $buefy.toast.open({
          message: error
        });
      }
    );
  }
});
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
