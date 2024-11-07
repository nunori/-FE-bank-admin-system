<script setup>
import Sidebar from "@/components/Sidebar.vue";
import { RouterView, useRoute } from "vue-router";

const route = useRoute();
const showSidebar = route.path !== "/";
</script>

<template>
  <div id="app">
    <Sidebar v-if="showSidebar" />

    <div :class="{ 'main-content': true, 'full-width': !showSidebar }">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
#app {
  display: flex;
}

.main-content {
  flex-grow: 1; /* 사이드바 옆에 메인 컨텐츠 영역이 확장됨 */
}
</style>
