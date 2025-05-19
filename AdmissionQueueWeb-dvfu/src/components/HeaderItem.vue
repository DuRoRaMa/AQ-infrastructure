<script setup lang="ts">
import { useAuth, useUser } from 'vue-auth3';
import fefu_logo from '@/assets/FEFU_logo.svg';
import { ref, watch } from 'vue';

const auth = useAuth();
const user = useUser();
const username = ref('');
watch(user, () => {
  if (user.value?.groups) {
    username.value = user.value.username;
  }
});
</script>
<template>
  <b-navbar v-show="$route.name !== 'tablo'">
    <template #brand>
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        <b-image :src="fefu_logo" alt="ЭО ПК ДВФУ" />
      </b-navbar-item>
    </template>
    <template #start>
      <b-navbar-item tag="router-link" :to="{ path: '/' }"> Главная </b-navbar-item>
      <b-navbar-item tag="router-link" :to="{ path: '/tablo' }"> Табло </b-navbar-item>
    </template>

    <template #end>
      <b-navbar-item tag="div">
        <div class="buttons">
          <b-navbar-item
            tag="router-link"
            :to="{ name: 'login' }"
            v-if="!auth.check()"
            class="button is-primary"
            type="is-primary"
            size="is-medium"
          >
            Войти
          </b-navbar-item>
          <b-navbar-item tag="div" v-else>
            <!-- <b-navbar-item
              tag="router-link"
              :to="{ name: 'profile' }"
              class="button is-primary"
              type="is-primary"
              size="is-medium"
            >
              Профиль
            </b-navbar-item> -->
            <p class="title is-5" style="margin-right: 50px; margin-top: 10px">
              {{ user.username }}
            </p>
            <a @click="auth.logout" class="button is-primary"> Выйти </a>
          </b-navbar-item>
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>
