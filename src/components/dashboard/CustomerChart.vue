<template>
  <div class="chart-container">
    <canvas ref="customerChartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import Chart from "chart.js/auto";

const props = defineProps({
  chartData: Array, // 데이터 배열
  labels: Array, // 레이블 배열
});

const chartInstance = ref(0);
const customerChartCanvas = ref(0);

onMounted(() => {
  renderChart();
});

watch(
  () => [props.chartData, props.labels],
  () => {
    if (chartInstance.value) {
      chartInstance.value.destroy();
    }
    renderChart();
  },
  { immediate: true }
);

function renderChart() {
  if (!customerChartCanvas.value) return;

  const ctx = customerChartCanvas.value.getContext("2d");

  chartInstance.value = new Chart(ctx, {
    type: "bar",
    data: {
      labels: props.labels,
      datasets: [
        {
          label: "내점 고객 수",
          data: props.chartData,
          backgroundColor: "#4caf50",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}
</script>

<style scoped>
.chart-container {
  height: 300px;
  background-color: #1f1f36;
  padding: 20px;
  border-radius: 10px;
}
</style>
