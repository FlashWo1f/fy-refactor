<template>
  <div class="activity-page">
    Activity
  </div>
</template>

<script>
import { onMounted } from 'vue'
export default {
  mounted() {
    log('*****')
  },
  setup() {
    onMounted(() => {
      log('*****')
    })
  }
}
</script>

<style>

</style>