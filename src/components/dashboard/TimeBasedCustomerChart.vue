<template>
  <div class="chart-container">
    <canvas id="time-based-customer-chart"></canvas>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import Chart from "chart.js/auto";

onMounted(() => {
  const ctx = document
    .getElementById("time-based-customer-chart")
    .getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: [
        "9 AM",
        "10 AM",
        "11 AM",
        "12 PM",
        "1 PM",
        "2 PM",
        "3 PM",
        "4 PM",
      ],
      datasets: [
        {
          label: "시간별 고객 수",
          data: [15, 30, 45, 60, 50, 40, 35, 20],
          borderColor: "#03a9f4",
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
});
</script>

<style scoped>
.chart-container {
  height: 300px;
  background-color: #1f1f36;
  padding: 20px;
  border-radius: 10px;
}
</style>
