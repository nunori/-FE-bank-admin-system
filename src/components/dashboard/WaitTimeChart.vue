<template>
  <div class="chart-container">
    <canvas id="wait-time-chart"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axiosInstance from "@/axios.js";
import Chart from "chart.js/auto";
import { useUserStore } from "@/stores/userStore";

const waitTimeData = ref([]);
const userStore = useUserStore();

const isTokenAvailable = () => {
  const accessToken = localStorage.getItem("accessToken");
  return accessToken !== null && accessToken !== "";
};

const formatDate = (date) => {
  return date.toISOString().split("T")[0];
};

const fetchWaitTimeData = async () => {
  if (!isTokenAvailable()) {
    console.error("Access token이 없습니다. 로그인 상태를 확인하세요.");
    return;
  }

  try {
    const today = new Date();
    // getUserDeptId() 대신 userDeptId 속성 직접 접근
    const deptId = userStore.userDeptId;

    // localStorage에서도 확인
    if (!deptId) {
      const storedDeptId = localStorage.getItem("userDeptId");
      if (storedDeptId) {
        deptId = storedDeptId;
      }
    }

    if (!deptId) {
      console.error("부서 ID를 찾을 수 없습니다.");
      return;
    }

    const requestData = {
      deptId: deptId, // 이미 서버에서 파싱하므로 parseInt 제거
      period: "day",
      date: formatDate(today),
    };

    console.log("요청 데이터:", requestData);

    const response = await axiosInstance.post(
      `/dashboard/customers/wait-time/avg`,
      requestData
    );

    console.log("대기 시간 평균 데이터: ", response.data);
    waitTimeData.value = response.data;
  } catch (error) {
    console.error("대기시간 평균 데이터 가져오기 오류: ", error);
    if (error.response) {
      console.error("에러 응답:", error.response.data);
      console.error("상태 코드:", error.response.status);
    }
  }
};

onMounted(async () => {
  await fetchWaitTimeData();

  const ctx = document.getElementById("wait-time-chart")?.getContext("2d");
  if (!ctx) {
    console.error("Canvas context를 가져올 수 없습니다.");
    return;
  }

  const labels = Array.from({ length: 10 }, (_, i) => `${i + 9}:00`);
  const dataPoints = Array.from({ length: 10 }, (_, i) => {
    return waitTimeData.value[i] || 0;
  });

  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "대기 시간 평균 (분)",
          data: dataPoints,
          borderColor: "#f44336",
          fill: false,
          tension: 0.4,
          pointBackgroundColor: "#f44336",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#fff",
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: "#fff",
          },
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
        },
        x: {
          ticks: {
            color: "#fff",
          },
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
        },
      },
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
  margin: 20px;
}
</style>
