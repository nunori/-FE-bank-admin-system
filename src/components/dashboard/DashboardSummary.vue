<template>
  <div class="dashboard-summary">
    <div class="summary-card" v-for="(item, index) in summaryData" :key="index">
      <h3>{{ item.title }}</h3>
      <p class="value">{{ item.value }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  summaryData: {
    type: Array,
    required: true,
  },
});
</script>

<style scoped>
.dashboard-summary {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.summary-card {
  background-color: #1f1f36;
  color: #ffffff;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  flex: 1;
  text-align: center;
}

.summary-card h3 {
  font-size: 14px;
  margin: 0;
  color: #b0b0b0;
}

.summary-card .value {
  font-size: 24px;
  font-weight: bold;
  margin-top: 10px;
}
</style>
