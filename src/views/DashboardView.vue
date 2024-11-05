<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/userStore.js";

import Sidebar from "@/components/Sidebar.vue";
import Dropdown from "@/components/dashboard/Dropdown.vue";
import DashboardSummary from "@/components/dashboard/DashboardSummary.vue";
import CustomerChart from "@/components/dashboard/CustomerChart.vue";
import WaitTimeChart from "@/components/dashboard/WaitTimeChart.vue";
import TimeBasedCustomerChart from "@/components/dashboard/TimeBasedCustomerChart.vue";

const summaryData = [
  { title: "내점 고객 수", value: "1,200명" },
  { title: "대기 시간 평균", value: "15분" },
];

function onBranchChange(selectedBranch) {
  console.log("Selected branch: ", selectedBranch);
}
</script>

<template>
  <div class="dashboard-container">
    <Sidebar />
    <div class="main-content">
      <div class="dropdown-container">
        <Dropdown @change="onBranchChange" />
      </div>
      <div class="grid-layout">
        <div class="grid-item">
          <DashboardSummary :summaryData="summaryData" />
        </div>
        <div class="grid-item">
          <CustomerChart />
        </div>
        <div class="grid-item">
          <WaitTimeChart />
        </div>
        <div class="grid-item">
          <TimeBasedCustomerChart />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  display: flex;
}

.main-content {
  flex: 1;
  padding: 5%;
  display: flex;
  flex-direction: column;
  height: 100vh; /* 전체 화면 높이를 차지하게 설정 */
}

.dropdown-container {
  margin-bottom: 5%;
  display: flex;
  align-items: center;
  gap: 2.5%;
}

.grid-layout {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 두 개의 열 */
  grid-template-rows: repeat(
    2,
    1fr
  ); /* 두 개의 행, 각 행의 높이를 동일하게 설정 */
  gap: 5%; /* 그리드 항목 사이의 간격 */
  flex: 1; /* 남은 공간을 차지 */
}

.grid-item {
  background-color: #ffffff;
  border-radius: 3%;
  padding: 2%; /* 패딩을 줄여서 공간을 최소화 */
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
}

@media (max-width: 192rem) {
  .grid-layout {
    grid-template-columns: 1fr; /* 한 열로 변경 */
    grid-template-rows: auto; /* 자동 높이 */
  }
}
</style>
