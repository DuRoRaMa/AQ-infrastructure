<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useLazyQuery } from '@vue/apollo-composable';
import { TALONS, type HistoryTalon } from '@/queries/historyTalons';
import { log } from 'console';

const perPage = 30;
const paginataion = reactive({ offset: 0, limit: perPage });
const order = reactive({});
const history_talons = useLazyQuery(
  TALONS,
  { pagination: paginataion, order: order },
  { fetchPolicy: 'network-only' }
);
const total = ref(0);
const loading = ref(false);
let data = reactive([] as HistoryTalon[]);
const orderings = {
  asc: 'ASC',
  desc: 'DESC'
};
const sortable_fields = ['id', 'name', 'createdAt'];
async function onSort(field: string, ord: string) {
  for (const f of sortable_fields) {
    order[f] = null;
  }
  order[field] = orderings[ord];
  await updateTable();
}
async function pageChange(page: number = 1) {
  paginataion.limit = perPage;
  paginataion.offset = (page - 1) * perPage;
  await updateTable();
}
async function updateTable() {
  loading.value = true;
  let res = await history_talons.load();
  if (!res) {
    res = (await history_talons.refetch())?.data;
  }
  data.splice(0, data.length);
  total.value = res.countHistoryTalons;
  let ndata = [];
  for (const talon of res.historyTalons as HistoryTalon[]) {
    ndata.push({
      id: talon.id,
      name: talon.name,
      createdAt: talon.createdAt,
      status: talon.logs.at(-1).action,
      user: talon.logs.at(-1).createdBy.username
    });
  }
  Object.assign(data, ndata);
  loading.value = false;
}
function blackColorClass(row, column) {
  if (column.field === 'status') {
    if (row.status === 'Cancelled') {
      return { style: { color: 'red' } };
    } else if (row.status === 'Completed') {
      return { style: { color: 'green' } };
    }
  }
  return {
    style: { color: 'black' }
  };
}
onMounted(updateTable);
</script>
<template>
  <div class="columns">
    <div class="column">
      <b-table
        :data="data"
        :bordered="true"
        :loading="loading"
        backend-pagination
        paginated
        :total="total"
        :per-page="perPage"
        pagination-position="both"
        @page-change="pageChange"
        backend-sorting
        @sort="onSort"
      >
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
          field="createdAt"
          label="Создан"
          :td-attrs="blackColorClass"
          v-slot="props"
          sortable
        >
          {{ new Date(props.row.createdAt).toLocaleString('ru-ru') }}
        </b-table-column>
        <b-table-column field="status" label="Статус" :td-attrs="blackColorClass" v-slot="props">
          {{ props.row.status }}
        </b-table-column>
        <b-table-column
          field="user"
          label="Пользователь"
          :td-attrs="blackColorClass"
          v-slot="props"
        >
          {{ props.row.user }}
        </b-table-column>
        <template #empty>
          <div class="has-text-centered" style="color: black">Нет данных</div>
        </template>
      </b-table>
    </div>
    <div class="column"></div>
  </div>
</template>
