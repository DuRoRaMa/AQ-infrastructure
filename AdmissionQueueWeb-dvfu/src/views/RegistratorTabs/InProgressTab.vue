<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useLazyQuery } from '@vue/apollo-composable';
import { TABLO_STATUS } from '@/queries/tabloTalons';

const tablo_status = useLazyQuery(TABLO_STATUS, {}, { fetchPolicy: 'network-only' });
let data = reactive([] as any[]);
let num = 1;
const lastTimeUpdated = ref<Date>();
function onSort(field, order) {
  num = 1;
}
async function updateTable() {
  data.splice(0, data.length);
  num = 1;
  let res = await tablo_status.load();
  let ndata = [];
  if (!res) {
    res = (await tablo_status.refetch())?.data;
  }

  for (const talon of res.tabloTalons) {
    let last_log = talon.logs.filter((x: any) => x.action === 'Assigned').at(-1);
    let status = [...talon.logs].sort((a, b) => Number(a.id) - Number(b.id)).at(-1).action;

    ndata.push({
      id: talon.id,
      name: talon?.name,
      location: last_log.createdBy.operatorSettings.location?.name || '-',
      operator: last_log.createdBy.username,
      action: status
    });
  }
  data.push(...ndata);
  data.sort((a, b) => a.id - b.id);
  lastTimeUpdated.value = new Date();
}
function blackColorClass(row, column) {
  return { style: { color: 'black' } };
}
</script>
<template>
  <div class="columns">
    <div class="column">
      <b-button @click="updateTable">Обновить</b-button>
      <p>Последний раз обновлено: {{ lastTimeUpdated?.toLocaleTimeString('ru-ru') }}</p>
      <b-table :data="data" :bordered="true" @sort="onSort">
        <b-table-column label="№" width="40" :td-attrs="blackColorClass" numeric centered>
          {{ num++ }}
        </b-table-column>
        <b-table-column
          field="id"
          label="ID"
          width="40"
          :td-attrs="blackColorClass"
          v-slot="props"
          numeric
          sortable
          centered
        >
          {{ props.row.id }}
        </b-table-column>
        <b-table-column
          field="name"
          label="Имя"
          :td-attrs="blackColorClass"
          v-slot="props"
          sortable
        >
          {{ props.row.name }}
        </b-table-column>
        <b-table-column
          field="location"
          label="Стол"
          :td-attrs="blackColorClass"
          v-slot="props"
          sortable
        >
          {{ props.row.location }}
        </b-table-column>
        <b-table-column
          field="operator"
          label="Пользователь"
          :td-attrs="blackColorClass"
          v-slot="props"
          sortable
        >
          {{ props.row.operator }}
        </b-table-column>
        <b-table-column
          field="action"
          label="Статус"
          :td-attrs="blackColorClass"
          v-slot="props"
          sortable
        >
          {{ props.row.action }}
        </b-table-column>
        <template #empty>
          <div class="has-text-centered" style="color: black">Нет данных</div>
        </template>
      </b-table>
    </div>
    <div class="column"></div>
  </div>
</template>
