<script setup lang="ts">
import { useUser } from 'vue-auth3'

const user = useUser()
</script>
<template lang="">
  <div>{{ user }}</div>
</template>
<style lang=""></style>
