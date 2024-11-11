<script setup>
import Dropdown from "@/components/dashboard/Dropdown.vue";
import DashboardSummary from "@/components/dashboard/DashboardSummary.vue";
import CustomerChart from "@/components/dashboard/CustomerChart.vue";
import WaitTimeChart from "@/components/dashboard/WaitTimeChart.vue";
import TimeBasedCustomerChart from "@/components/dashboard/TimeBasedCustomerChart.vue";
import DatePickerModal from "@/components/dashboard/DatePickerModal.vue";
import axiosInstance from "@/axios.js";
import { ref, watch } from "vue";

// 상태 관리 - 기본 값 설정
const summaryData = ref([]);
const chartData = ref([]);
const waitTimeData = ref([]);
const selectedBranch = ref(1); // 기본 deptId = 1
const showModal = ref(false);
const dateRange = ref({
  startDate: "2024-11-01", // 기본 시작 날짜
  endDate: "2024-11-11", // 기본 종료 날짜
});

// summaryData를 동적으로 가져오기 위한 함수
const fetchSummaryData = async () => {
  if (
    !selectedBranch.value ||
    !dateRange.value.startDate ||
    !dateRange.value.endDate
  )
    return;

  try {
    const response = await axiosInstance.post("/dashboard/summary", {
      deptId: selectedBranch.value,
      startDate: dateRange.value.startDate,
      endDate: dateRange.value.endDate,
    });
    summaryData.value = response.data;
  } catch (error) {
    console.error("요약 데이터를 가져오는 중 오류 발생:", error);
  }
};

// CustomerChart 및 WaitTimeChart 데이터를 가져오기 위한 함수
const fetchChartData = async () => {
  if (
    !selectedBranch.value ||
    !dateRange.value.startDate ||
    !dateRange.value.endDate
  )
    return;

  try {
    const response = await axiosInstance.post("/dashboard/customers/data", {
      deptId: selectedBranch.value,
      startDate: dateRange.value.startDate,
      endDate: dateRange.value.endDate,
    });
    chartData.value = response.data;
  } catch (error) {
    console.error("고객 차트 데이터를 가져오는 중 오류 발생:", error);
  }
};

// 대기 시간 차트 데이터 가져오기 함수
const fetchWaitTimeData = async () => {
  if (
    !selectedBranch.value ||
    !dateRange.value.startDate ||
    !dateRange.value.endDate
  )
    return;

  try {
    const response = await axiosInstance.post(
      "/dashboard/customers/wait-time/avg",
      {
        deptId: selectedBranch.value,
        startDate: dateRange.value.startDate,
        endDate: dateRange.value.endDate,
      }
    );
    waitTimeData.value = response.data;
  } catch (error) {
    console.error("대기 시간 데이터를 가져오는 중 오류 발생:", error);
  }
};

// 지점 선택 시 이벤트
function onBranchChange(branchId) {
  selectedBranch.value = branchId;
  console.log("선택된 지점 ID:", selectedBranch.value);
}

// 날짜 선택 시 이벤트
function onDateSelected(dates) {
  dateRange.value = dates;
}

// 선택된 지점이나 날짜가 변경될 때마다 데이터를 다시 가져와 차트와 요약 데이터를 새로고침
watch([selectedBranch, dateRange], () => {
  fetchSummaryData();
  fetchChartData();
  fetchWaitTimeData();
});
</script>

<template>
  <div class="dashboard-container">
    <div class="info-container">
      <!-- 지점 선택 드롭다운 -->
      <div class="dropdown-container">
        <Dropdown @branch-change="onBranchChange" />
      </div>

      <!-- 날짜 선택 모달 -->
      <div class="date-picker-container">
        <button @click="showModal = true">날짜 선택</button>
        <DatePickerModal
          v-if="showModal"
          :showModal="showModal"
          @close="showModal = false"
          @dateSelected="onDateSelected"
        />
      </div>

      <!-- 대시보드 요약 -->
      <div class="grid-layout">
        <div class="grid-item">
          <DashboardSummary :summaryData="summaryData" />
        </div>

        <!-- 차트 컴포넌트들 -->
        <div class="grid-item">
          <CustomerChart :chartData="chartData" />
        </div>
        <div class="grid-item">
          <WaitTimeChart :waitTimeData="waitTimeData" />
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
