<template>
  <div class="preview-container">
    <h2 class="title">미리보기</h2>
    <div class="kiosk-display">
      <div class="image-container">
        <img src="@/assets/img/imbank_ai.png" alt="ai_img" />
      </div>
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
.preview-container {
  width: 80dvh * 9/16;
  height: 90dvh;
  background: #1a1a2e;
  border-radius: 1rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 1.5rem;
  color: #ffffff;
  margin-bottom: 1rem;
  font-weight: 600;
}

.kiosk-display {
  position: relative;
  width: 80dvh * 9/16;
  height: 80dvh;
  max-width: 100%;
  aspect-ratio: 9/16;
  background: white;
  border: 1px solid #e1e1e1;
  border-radius: 0.5rem;
  display: flex;
  overflow: hidden;
}

.image-container {
  flex: 1;
  height: 100%;
  max-width: 50%;
  overflow: hidden;
  border-right: 1px solid #e1e1e1;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.buttons-container {
  flex: 1;
  height: 100%;
  max-width: 50%;
  background: white;
  display: flex;
  flex-direction: column;
  height: 95%;
  margin: 1rem;
  gap: 0.5rem;
}

.preview-button {
  flex: 1;
  width: 100%;
  background-color: #06c7aa;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: clamp(0.75rem, 1.5vw, 1rem);
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  padding: 0.5rem 1rem;
  white-space: pre-wrap;
  cursor: pointer;
  transition: all 0.2s;
}

.preview-button:hover {
  background-color: #2980b9;
  transform: translateY(-0.125rem);
}

/* @media (max-width: 64rem) {
  .kiosk-preview {
    max-height: 80vh;
  }

  .kiosk-display {
    width: 100%;
    max-width: none;
  }
} */

@media (max-width: 48rem) {
  .kiosk-preview {
    padding: 1rem;
  }

  .preview-container {
    padding: 0.75rem;
  }

  .buttons-container {
    gap: 0.25rem;
  }
}

@media (max-width: 5rem) {
  .kiosk-preview {
    padding: 0.75rem;
  }

  .preview-container {
    padding: 0.5rem;
  }
}
</style>
