<script setup>
import Sidebar from "@/components/Sidebar.vue";
import Dropdown from "@/components/dashboard/Dropdown.vue";
import DashboardSummary from "@/components/dashboard/DashboardSummary.vue";
import CustomerChart from "@/components/dashboard/CustomerChart.vue";
import WaitTimeChart from "@/components/dashboard/WaitTimeChart.vue";
import TimeBasedCustomerChart from "@/components/dashboard/TimeBasedCustomerChart.vue";
import DatePickerModal from "@/components/dashboard/DatePickerModal.vue";
import axiosInstance from "@/axios.js";
import { ref } from "vue";

const summaryData = [
  { title: "내점 고객 수", value: "1,200명" },
  { title: "대기 시간 평균", value: "15분" },
];

function onBranchChange(selectedBranch) {
  console.log("Selected branch: ", selectedBranch);
}

const showModal = ref(false);

const fetchData = async ({ startDate, endDate }) => {
  try {
    const response = await axiosInstance.post(`/dashboard/customers/count`, {
      deptId: "02",
      period: "day",
      startDate: startDate,
      endDate: endDate,
    });
    console.log("선택한 날짜:", { startDate, endDate });
    console.log("날짜 response: ", response.data);
  } catch (error) {
    console.error("날짜선택 오류: ", error);
  }
};

const onDateSelected = (dates) => {
  fetchData(dates);
};
</script>

<template>
  <div class="dashboard-container">
    <div class="info-container">
      <div class="dropdown-container">
        <Dropdown @change="onBranchChange" />
      </div>
      <div class="date-picker-container">
        <button @click="showModal = true">달력 아이콘</button>
        <DatePickerModal
          v-if="showModal"
          :showModal="showModal"
          @close="showModal = false"
          :onDateSelected="onDateSelected"
        />
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
  flex-direction: row;
}

.info-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 1rem;
}

.dropdown-container {
  display: flex;
  align-items: center;
  gap: 2.5%;
}

.grid-layout {
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
