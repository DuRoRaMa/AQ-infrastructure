<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAuth } from 'vue-auth3'
import { NotificationProgrammatic } from '@ntohq/buefy-next'
import type { AxiosError } from 'axios'
interface User {
  id: string
  email: string
  username: string
}
let props = reactive({ username: '', password: '' })
let loadingLogin = ref(false)
const auth = useAuth()
function login() {
  loadingLogin.value = true
  auth
    .login({
      data: props
    })
    .catch((error: AxiosError) => {
      if (error.response?.status === 401) {
        auth.token(null, null)
      }
    })
    .then(() => {
      loadingLogin.value = false
      auth.fetch().then(() => {
        new NotificationProgrammatic().open({
          message: `Добро пожаловать, ${auth.user<User>()?.username}`,
          duration: 5000,
          type: 'is-primary',
          pauseOnHover: true
        })
      })
    })
}
</script>
<template>
  <section class="hero is-fullheight-with-navbar">
    <div class="hero-body container">
      <form action="">
        <div class="" style="width: auto">
          <header class="section container">
            <p class="title has-text-centered">Авторизоваться</p>
          </header>
          <section class="">
            <b-field label="Username">
              <b-input
                type="username"
                v-model="props.username"
                placeholder="Ваш корпоративный логин"
                required
              >
              </b-input>
            </b-field>

            <b-field label="Пароль">
              <b-input
                type="password"
                v-model="props.password"
                password-reveal
                placeholder="Your password"
                required
              >
              </b-input>
            </b-field>
          </section>
          <footer class="container">
            <b-button @click="login" :loading="loadingLogin" label="Войти" type="is-primary" />
          </footer>
        </div>
      </form>
    </div>
  </section>
</template>
