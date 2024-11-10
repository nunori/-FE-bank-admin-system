<template>
  <div class="page-container">
    <div class="main-content">
      <!-- 좌측에 미리보기, 우측에 버튼 관리 -->
      <div class="content-left">
        <KioskButtonPreview />
      </div>
      <div class="content-right">
        <KioskButtons />
      </div>
    </div>
  </div>
</template>

<script setup>
import KioskButtons from "@/components/kiosk/KioskButtons.vue";
import KioskButtonPreview from "@/components/kiosk/KioskButtonPreview.vue";
</script>

<style scoped>
.page-container {
  width: 100%;
  min-height: 100dvh;
  padding: 2rem;
}

.main-content {
  display: flex;
  gap: 2rem;
  max-width: 100%;
}

.content-left {
  flex: 1;
  min-width: 18.75raem; /* 300px */
  max-width: 28.125rem; /* 450px */
}

.content-right {
  flex: 1.5;
}

/* 반응형 처리 */
@media (max-width: 64rem) {
  /* 1024px */
  .main-content {
    flex-direction: column;
  }

  .content-left,
  .content-right {
    width: 100%;
    max-width: 100%;
    min-width: auto;
  }
}
</style>
