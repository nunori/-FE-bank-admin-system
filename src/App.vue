<script setup>
import Sidebar from "@/components/Sidebar.vue";
import { RouterView, useRoute } from "vue-router";
import { ref, watch } from "vue";

const route = useRoute();
const showSidebar = ref(route.path !== "/home");

watch(
  () => route.path,
  (newPath) => {
    showSidebar.value = newPath !== "/home";
  }
);
</script>

<template>
  <div id="app">
    <Sidebar v-if="showSidebar" class="sidebar" />
    <div :class="{ 'main-content': true, 'full-width': !showSidebar }">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
#app {
  display: flex;
  min-height: 100vh; /* 전체 뷰포트 높이 */
  height: 100vh; /* 고정 높이 */
}

.sidebar {
  height: 100%; /* 부모(#app)의 높이를 따라감 */
}

.main-content {
  flex-grow: 1;
  height: 100vh; /* 전체 높이 */
  overflow-y: auto; /* 내용이 넘칠 경우 스크롤 */
}

.full-width {
  width: 100%;
}
</style>
