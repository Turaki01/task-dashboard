<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-title>Task Management Dashboard</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.message }}
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const snackbar = reactive({
  show: false,
  message: '',
  color: 'success',
})

defineExpose({
  showMessage: (message: string, color = 'success') => {
    snackbar.message = message
    snackbar.color = color
    snackbar.show = true
  },
})
</script>

<style>
/* Global styles */
.v-application {
  font-family: 'Roboto', sans-serif;
}
</style>
