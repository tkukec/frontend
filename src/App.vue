<script lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import NavbarComponent from './components/NavbarComponent.vue'
export default {
  components: {
    NavbarComponent
  }
}
</script>

<template>
  <NavbarComponent />
  <RouterView />
</template>
