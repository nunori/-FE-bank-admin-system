<template>
  <div class="chart-container">
    <canvas id="customer-chart"></canvas>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import Chart from "chart.js/auto";

onMounted(() => {
  const ctx = document.getElementById("customer-chart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "내점 고객 수",
          data: [120, 150, 100, 170, 130, 180, 200],
          backgroundColor: "#4caf50",
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
