<template>
  <a-config-provider :locale="zh_CN">
    <router-view></router-view>
  </a-config-provider>
</template>

<script lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import zh_CN from 'ant-design-vue/es/locale/zh_CN'
export default {
  setup() {
    return {
      zh_CN
    }
  }
}
</script>

<style>
#app {
  
}
</style>
