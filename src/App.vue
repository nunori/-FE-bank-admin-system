<script setup>
import Sidebar from "@/components/Sidebar.vue";
import { RouterView, useRoute } from "vue-router";
import { ref, watch } from "vue";

const route = useRoute();
const showSidebar = ref(route.path !== "/home"); // 초기 경로에 따라 설정

// 경로가 변경될 때마다 showSidebar를 업데이트
watch(
  () => route.path,
  (newPath) => {
    showSidebar.value = newPath !== "/home";
  }
);
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
