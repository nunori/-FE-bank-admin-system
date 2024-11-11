<script setup>
import { computed } from "vue";

const props = defineProps({
  title: String,
  value: String,
  info: String,
  percentage: String,
});

// percentage에 따른 클래스 설정
const percentageClass = computed(() => {
  return props.percentage.startsWith("-") ? "negative" : "positive";
});

// value가 null일 때 0으로 표시
const displayValue = computed(() => {
  return props.value ?? "0";
});
</script>

<template>
  <div class="summary-card">
    <div class="card-header">
      <h3>{{ title }}</h3>
      <p class="info">{{ info }}</p>
    </div>
    <div class="card-body">
      <p class="value">{{ displayValue }}</p>
      <p class="percentage" :class="percentageClass">{{ percentage }}</p>
    </div>
  </div>
</template>

<style scoped>
.summary-card {
  background-color: #1f1f36;
  color: #ffffff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-header {
  display: flex;
  flex-direction: column;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: #e0e0e0;
}

.card-header .info {
  font-size: 12px;
  color: #b0b0b0;
}

.card-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-body .value {
  font-size: 24px;
  font-weight: bold;
}

.card-body .percentage {
  font-size: 14px;
  font-weight: bold;
}

.positive {
  color: #4caf50; /* 증가일 때 초록색 */
}

.negative {
  color: #f44336; /* 감소일 때 빨간색 */
}
</style>
