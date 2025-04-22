<script setup>
import { useUserStore } from "@/stores.js";

const userStore = useUserStore();
</script>

<template>
  <h1>{{ userStore.user["name"] }} 用户中心</h1>
</template>

<style scoped>

</style>