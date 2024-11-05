<template>
  <div class="chart-container">
    <canvas id="wait-time-chart"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axiosInstance from "@/axios.js";
import Chart from "chart.js/auto";

const waitTimeData = ref([]);

const isTokenAvailable = () => {
  const accessToken = localStorage.getItem("accessToken");
  return accessToken !== null && accessToken !== "";
};

const fetchWaitTimeData = async () => {
  if (!isTokenAvailable()) {
    console.error("Access token이 없습니다. 로그인 상태를 확인하세요.");
    return;
  }
  try {
    const response = await axiosInstance.post(
      `/dashboard/customers/wait-time/avg`,
      {
        deptId: "02",
        period: "day", // 부서 ID를 필요한 값으로 설정
        date: "2024-11-02", // 요청할 날짜
      }
    );
    console.log("대기 시간 평균 데이터: ", response.data);
    waitTimeData.value = response.data; // 가져온 데이터를 waitTimeData에 저장
  } catch (error) {
    console.error("대기시간 평균 데이터 가져오기 오류: ", error);
  }
};

onMounted(async () => {
  await fetchWaitTimeData(); // 컴포넌트가 마운트될 때 데이터 가져오기
  const ctx = document.getElementById("wait-time-chart").getContext("2d");

  const labels = [];
  const dataPoints = [];

  // 09:00부터 18:00까지의 레이블 생성
  for (let hour = 9; hour <= 18; hour++) {
    labels.push(`${hour}:00`);
  }

  // 백엔드에서 반환된 대기시간 데이터를 09:00부터 18:00에 맞게 설정
  for (let i = 0; i < labels.length; i++) {
    dataPoints.push(waitTimeData.value[i] || 0); // 데이터가 없을 경우 0으로 설정
  }

  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels, // 09:00부터 18:00까지의 레이블
      datasets: [
        {
          label: "대기 시간 평균 (분)",
          data: dataPoints, // API에서 가져온 데이터 사용
          borderColor: "#f44336",
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
