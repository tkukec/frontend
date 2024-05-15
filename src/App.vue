<script lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import NavbarComponent from './components/NavbarComponent.vue'
import { initFlowbite } from 'flowbite'
initFlowbite()
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
