<script setup lang="ts">
const { talon } = defineProps(['talon']);
</script>
<template>
  <div class="column is-two-fifths" style="margin-bottom: 36px">
    <div class="columns">
      <div class="column"></div>
      <div class="column is-two-thirds">
        <p style="min-width: 7ch">
          {{ talon.name }}
        </p>
      </div>
    </div>
  </div>
  <div class="column is-two-fifths" style="margin-bottom: 36px">
    <img src="@/assets/TabloArrow.svg" alt="" style="padding-left: 24%; transform: scale(0.8)" />
  </div>
  <div class="column is-one-fifth" style="margin-bottom: 36px">
    <p>
      {{ talon.location }}
    </p>
  </div>
</template>
<style scoped>
p {
  text-align: center;
  font-family: HeliosC;
  font-weight: 800;
  font-size: 40px;
  background-color: #1d3d84;
  color: white;
  border-radius: 50px;
  /* margin-top: 10px; */
}
</style>
