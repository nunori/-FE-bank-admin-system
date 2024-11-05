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
    <div class="info-container">
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
    <!-- dvw width 반응형으로 작동 -->
  </div>
</template>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: row;
}

.info-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.dropdown-container {
  margin-bottom: 3rem;
  display: flex;
  align-items: center;
  gap: 2.5%;
}

.grid-layout {
  /* width: 100%; */
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 5%;
  flex: 1;
}

.grid-item {
  background-color: #ffffff;
  border-radius: 3%;
  padding: 2%;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
}
</style>
