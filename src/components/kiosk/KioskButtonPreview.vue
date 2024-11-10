<template>
  <div class="kiosk-preview">
    <div class="preview-container">
      <h2 class="title">미리보기</h2>
      <div class="buttons-container">
        <button
          v-for="item in visibleItems"
          :key="item.buttonId"
          class="preview-button"
        >
          {{ item.buttonName }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useKioskButtonStore } from "@/stores/kioskButtonStore";

const kioskButtonStore = useKioskButtonStore();
const visibleItems = computed(() => kioskButtonStore.visibleItems);
</script>

<style scoped>
.kiosk-preview {
  background: white;
  border-radius: 2rem;
  padding: 2rem;
  box-shadow: 0 0.125rem 0.75rem rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.preview-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  margin: 0 auto;
  background: #f8f9fa;
  border-radius: 1rem;
  width: 1200px;
  height: 2000px;
  max-width: 100%;
  max-height: calc(100vh - 8rem);
  overflow: hidden;
}

.title {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-weight: 600;
  text-align: center;
}

.buttons-container {
  flex: 1;
  background: #f8f9fa;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  border: 1px solid black;
  width: 90%;
  height: 100%;
}

.preview-button {
  width: 100%;
  padding: 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  text-align: left;
  min-height: 3.75rem;
  white-space: pre-wrap;
  cursor: pointer;
  transition: all 0.2s;
}

.preview-button:hover {
  background-color: #2980b9;
  transform: translateY(-0.125rem);
}

@media (max-width: 64rem) {
  .preview-container {
    width: 80%;
    height: auto;
    aspect-ratio: 9/16;
  }
}

@media (max-width: 48rem) {
  .preview-container {
    width: 70%;
    height: auto;
    aspect-ratio: 9/16;
  }
}

@media (max-width: 30rem) {
  .kiosk-preview {
    padding: 1rem;
  }
  .preview-container {
    width: 100%;
    height: auto;
    aspect-ratio: 9/16;
  }
}
</style>
