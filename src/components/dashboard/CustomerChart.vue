<template>
  <div class="chart-container">
    <canvas id="customer-chart"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Chart from "chart.js/auto";
import axiosInstance from "@/axios.js";

const chartData = ref([]); // API로부터 데이터를 저장할 변수

// API에서 데이터를 가져오는 함수
const fetchChartData = async () => {
  try {
    const response = await axiosInstance.post("/dashboard/customers/data", {
      deptId: "02", // 선택한 지점 ID로 교체
      startDate: "2024-11-01", // 시작 날짜로 교체
      endDate: "2024-11-07", // 종료 날짜로 교체
    });
    chartData.value = response.data; // API로부터 받은 데이터를 저장
  } catch (error) {
    console.error("차트 데이터를 가져오는 중 오류 발생:", error);
  }
};

onMounted(async () => {
  await fetchChartData(); // 데이터 가져오기

  const ctx = document.getElementById("customer-chart").getContext("2d");

  // 가져온 데이터를 기반으로 차트를 생성
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: chartData.value.labels || [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun",
      ], // 예비 레이블
      datasets: [
        {
          label: "내점 고객 수",
          data: chartData.value.data || [0, 0, 0, 0, 0, 0, 0], // API에서 가져온 데이터
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
