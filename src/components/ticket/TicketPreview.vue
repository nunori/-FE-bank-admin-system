<template>
  <div class="ticket-preview">
    <div class="preview-container">
      <h2 class="title">미리보기</h2>
      <div class="buttons-container">
        <div v-for="item in visibleItems" :key="item.id" class="preview-button">
          <!-- 로고인 경우 이미지를, 아닌 경우 텍스트를 표시 -->
          <template v-if="item.name === '로고'">
            <img
              src="@/assets/img/imbank_logo.png"
              alt="IM Bank Logo"
              class="logo-image"
            />
          </template>
          <template v-else>
            {{ item.description || item.name }}
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { usePreviewStore } from "@/stores/previewStore.js";

const previewStore = usePreviewStore();

const visibleItems = computed(() => {
  return previewStore.visibleItems
    .filter((item) => item.visible)
    .sort((a, b) => a.position - b.position);
});
</script>

<style scoped>
/* 기존 스타일 추가 */
.ticket-preview {
  background: white;
  border-radius: 2rem;
  padding: 3rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  margin: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.preview-container {
  width: 8cm;
}

.title {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 20px;
  font-weight: 600;
}

.buttons-container {
  display: grid;
  grid-template-columns: repeat(1, minmax(10px, 1fr));
  gap: 16px;
  padding: 16px;
  background: #f8f9fa;
  text-align: center; /* 컨테이너 중앙 정렬 */
  border: 1px solid rgb(156, 156, 156);
}

.preview-button {
  padding: 16px;
  color: #000000;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.preview-button:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
}

.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-image {
  max-width: 10rem;
  height: auto;
  display: block;
  margin: 0 auto;
}
</style>
