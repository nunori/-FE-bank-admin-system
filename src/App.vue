<script setup>
import Sidebar from "@/components/Sidebar.vue";
import { RouterView, useRoute, useRouter } from "vue-router";
import { ref, watch, onMounted, onBeforeUnmount } from "vue";

const route = useRoute();
const router = useRouter();
const showSidebar = ref(route.path !== "/home" && route.path !== "/");

// 타이머 관련 변수
let inactivityTimer = null;
let warningTimer = null;
const TIMEOUT_DURATION = 60 * 1000 * 5;
const WARNING_DURATION = 10 * 1000 * 4; // 50초 후 경고

// 타이머 리셋 함수
const resetInactivityTimer = () => {
  // 로그인이 필요없는 페이지에서는 타이머를 설정하지 않음
  if (
    route.path === "/home" ||
    route.path === "/" ||
    route.path === "/register"
  ) {
    clearTimers();
    return;
  }

  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
  }
  if (warningTimer) {
    clearTimeout(warningTimer);
  }

  // 경고 타이머 설정 (50초 후 경고)
  warningTimer = setTimeout(() => {
    alert(
      "1분 후 로그아웃 되어 메인 화면으로 이동합니다. 계속하시려면 화면을 클릭해주세요."
    );
  }, TIMEOUT_DURATION - WARNING_DURATION);

  // 리다이렉트 타이머 설정 (1분 후 리다이렉트)
  inactivityTimer = setTimeout(() => {
    router.push("/home");
  }, TIMEOUT_DURATION);
};

// 타이머 클리어 함수
const clearTimers = () => {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
  }
  if (warningTimer) {
    clearTimeout(warningTimer);
  }
};

// 이벤트 리스너 설정 함수
const setupActivityListeners = () => {
  const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
  events.forEach((event) => {
    document.addEventListener(event, resetInactivityTimer);
  });
};

// 이벤트 리스너 제거 함수
const cleanupActivityListeners = () => {
  const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
  events.forEach((event) => {
    document.removeEventListener(event, resetInactivityTimer);
  });
  clearTimers();
};

// 라우트 변경 감시
watch(
  () => route.path,
  (newPath) => {
    showSidebar.value =
      newPath !== "/home" && newPath !== "/" && newPath !== "/register";
    // 라우트 변경 시 타이머 재설정
    resetInactivityTimer();
  }
);

// mounted와 unmounted 훅에서 설정/해제
onMounted(() => {
  setupActivityListeners();
  resetInactivityTimer(); // 초기 타이머 설정
});

onBeforeUnmount(() => {
  cleanupActivityListeners();
});
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
