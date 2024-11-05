<template>
  <div class="kiosk-customization">
    <div class="header">
      <h2>추가할 버튼</h2>
      <div class="date-time">
        <span>2024년 10월 31일</span>
        <span>16:27</span>
      </div>
    </div>

    <div class="image-container">
      <img src="../assets/image.png" alt="Kiosk" class="kiosk-image" />
      <div class="current-queue">현재 대기인수: <strong>0명</strong></div>
    </div>

    <div class="button-grid">
      <div class="button-item" v-for="(button, index) in buttons" :key="index">
        <div class="button-label">{{ button.label }}</div>
        <div class="button-description">{{ button.description }}</div>
      </div>
    </div>

    <div class="counter">
      <button @click="decreaseCounter">-</button>
      <span>{{ currentCount }}</span>
      <button @click="increaseCounter">+</button>
    </div>

    <button class="apply-button">적용하기</button>
  </div>
</template>

<script setup>
import { ref } from "vue";

const buttons = ref([
  { label: "대구로 페이지", description: "Description" },
  { label: "환전", description: "Description" },
  { label: "기업대출", description: "Description" },
  { label: "일반", description: "Description" },
  { label: "대출", description: "Description" },
]);

const currentCount = ref(0);

function increaseCounter() {
  currentCount.value++;
}

function decreaseCounter() {
  if (currentCount.value > 0) {
    currentCount.value--;
  }
}
</script>

<style scoped>
.kiosk-customization {
  display: flex;
  flex-direction: column;
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.kiosk-image {
  width: 100%;
  height: auto;
  border-radius: 12px;
}

.current-queue {
  margin-top: 1rem;
  font-size: 1.5rem;
}

.button-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin: 2rem 0;
}

.button-item {
  background-color: #e0f7fa;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

.button-label {
  font-weight: bold;
}

.counter {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2rem 0;
}

.counter button {
  background-color: #4e73df;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  margin: 0 1rem;
  cursor: pointer;
}

.apply-button {
  background-color: #4e73df;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  font-size: 1.2rem;
  transition: background-color 0.3s;
}

.apply-button:hover {
  background-color: #3b5bce;
}
</style>
