<script setup lang="ts">
import { onMounted, reactive, watch } from 'vue';
import { useUser, useAuth } from 'vue-auth3';
const auth = useAuth();
const user = useUser();
const roles = reactive({ Operators: false, Registrators: false, Admins: false });
const buttons = reactive([
  { if: 'Operators', name: 'operator', text: 'Оператор' },
  { if: 'Registrators', name: 'registrator', text: 'Ресепшен' },
  { if: 'Admins', name: 'dashboard', text: 'Дашборд' }
]);
watch(
  user,
  () => {
    if (user.value?.groups) {
      user.value.groups.forEach((x: string) => {
        roles[x] = true;
      });
    } else {
      roles.Registrators = false;
      roles.Operators = false;
      roles.Admins = false;
    }
  },
  { immediate: true }
);
</script>
<template>
  <section class="hero is-large container">
    <div class="hero-body">
      <div class="columns">
        <b-button
          v-for="button in buttons"
          :key="button.name"
          v-show="roles[button.if]"
          tag="router-link"
          :to="{ name: button.name }"
          class="column is-large is-primary"
          style="margin-right: 20px"
        >
          {{ button.text }}
        </b-button>
      </div>
    </div>
  </section>
</template>
