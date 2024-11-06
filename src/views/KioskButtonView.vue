<script setup>
import KioskButtonCustomization from "@/components/kiosk/KioskButtonCustomization.vue";
import Sidebar from "@/components/Sidebar.vue";
</script>

<template>
  <div class="page-container">
    <Sidebar />
    <div class="main-content">
      <KioskButtonCustomization />
    </div>
  </div>
</template>

<style scoped>
.page-container {
  display: flex; /* Flexbox를 사용하여 가로로 배치 */
  height: 100vh; /* 전체 높이를 사용 */
}

.main-content {
  flex: 1; /* 남은 공간을 차지 */
  padding: 2rem; /* 패딩 추가 */
  overflow-y: auto; /* 세로 스크롤 가능 */
}
</style>
