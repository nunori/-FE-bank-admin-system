<template>
  <div class="ticket-preview">
    <div class="preview-container">
      <h2 class="title">미리보기</h2>
      <div class="buttons-container">
        <button
          v-for="item in visibleItems"
          :key="item.id"
          class="preview-button"
        >
          <!-- {{ item.description || item.name }} -->
          {{ item.description || item.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { usePreviewStore } from "@/stores/previewStore.js";

const previewStore = usePreviewStore();
const visibleItems = computed(() => {
  console.log("Preview items:", previewStore.visibleItems); // 디버깅용
  return previewStore.visibleItems;
});
</script>

<style scoped>
.ticket-preview {
  background: white;
  border-radius: 2rem;
  padding: 3rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  width: 100%; /* 변경: 고정 너비 제거 */
  margin: 0; /* 변경: margin 제거 */
}

.preview-container {
  height: 100%;
}

.title {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 20px;
  font-weight: 600;
}

.buttons-container {
  display: grid;
  grid-template-columns: repeat(1, minmax(10px, 1fr)); /* 변경: 반응형 그리드 */
  gap: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.preview-button {
  padding: 16px;
  background-color: #3498db;
  color: white;
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

.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
}

.preview-button {
  white-space: pre-wrap;
  text-align: left;
  min-height: 60px;
}
</style>
