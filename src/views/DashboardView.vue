<template>
  <div class="dashboard-container">
    <div class="info-container">
      <!-- 지점 선택 드롭다운 -->
      <div class="dropdown-container">
        <Dropdown @branch-change="onBranchChange" />
      </div>

      <!-- 날짜 선택 모달 -->
      <div class="date-picker-container">
        <button class="styled-button" @click="showDateModal = true">
          날짜 선택
        </button>
        <DatePickerModal
          v-if="showDateModal"
          :showModal="showDateModal"
          @close="showDateModal = false"
          @dateSelected="onDateSelected"
        />
      </div>
      <div
        class="date-range-display"
        v-if="dateRange.startDate && dateRange.endDate"
      >
        <p>시작 날짜: {{ formattedStartDate }}</p>
        <p>종료 날짜: {{ formattedEndDate }}</p>
      </div>

      <!-- 조회 단위 선택 -->
      <div class="filter-container">
        <label>조회 단위:</label>
        <select v-model="selectedPeriod">
          <option value="custom">직접 설정</option>
          <option value="day">일별</option>
          <option value="month">월별</option>
          <option value="year">연별</option>
        </select>
      </div>

      <!-- 조회 버튼 -->
      <button class="styled-button" @click="fetchDashboardData">조회</button>

      <!-- 대시보드 요약 및 차트 컴포넌트 -->
      <div class="grid-layout">
        <div class="grid-item">
          <DashboardSummary :summaryData="summaryData" />
        </div>
        <div class="grid-item">
          <CustomerChart
            :chartData="chartData.data"
            :labels="chartData.labels"
          />
        </div>
        <div class="grid-item">
          <WaitTimeChart
            :waitTimeData="waitTimeData"
            :period="selectedPeriod"
          />
        </div>
        <div class="grid-item">
          <TimeBasedCustomerChart />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import Dropdown from "@/components/dashboard/Dropdown.vue";
import DatePickerModal from "@/components/dashboard/DatePickerModal.vue";
import DashboardSummary from "@/components/dashboard/DashboardSummary.vue";
import CustomerChart from "@/components/dashboard/CustomerChart.vue";
import WaitTimeChart from "@/components/dashboard/WaitTimeChart.vue";
import TimeBasedCustomerChart from "@/components/dashboard/TimeBasedCustomerChart.vue";
import axiosInstance from "@/axios.js";

const summaryData = ref([]);
const chartData = ref([]);
const waitTimeData = ref([]);
const selectedBranch = ref(1);
const showDateModal = ref(false);
const dateRange = ref({ startDate: "2024-11-01", endDate: "2024-11-11" });
const selectedPeriod = ref("custom");

const formattedStartDate = computed(() => {
  return dateRange.value.startDate
    ? new Date(dateRange.value.startDate).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";
});

const formattedEndDate = computed(() => {
  return dateRange.value.endDate
    ? new Date(dateRange.value.endDate).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";
});

function onBranchChange(branchId) {
  selectedBranch.value = branchId;
}

function onDateSelected(dates) {
  dateRange.value = dates;
}

async function fetchDashboardData() {
  if (!selectedBranch.value) {
    console.error("지점을 선택해주세요.");
    return;
  }

  try {
    let startDate = dateRange.value.startDate;
    let endDate = dateRange.value.endDate;
    let type = selectedPeriod.value;

    // 기간별 날짜 처리
    if (selectedPeriod.value === "custom") {
      startDate = `${startDate}T00:00:00`;
      endDate = `${endDate}T23:59:59`;
    } else if (selectedPeriod.value === "day") {
      endDate = startDate;
      startDate = `${startDate}T00:00:00`;
      endDate = `${endDate}T23:59:59`;
    } else if (selectedPeriod.value === "month") {
      startDate = `${startDate.substring(0, 4)}-01-01T00:00:00`;
      endDate = `${startDate.substring(0, 4)}-12-31T23:59:59`;
    } else if (selectedPeriod.value === "year") {
      const endYear = new Date().getFullYear();
      const startYear = endYear - 4;
      startDate = `${startYear}-01-01T00:00:00`;
      endDate = `${endYear}-12-31T23:59:59`;
    }

    await fetchData(selectedBranch.value, startDate, endDate, type);
  } catch (error) {
    console.error("대시보드 데이터를 가져오는 중 오류 발생:", error);
  }
}

async function fetchData(deptId, startDate, endDate, type) {
  try {
    // 요약 데이터 요청
    const summaryResponse = await axiosInstance.post("/dashboard/summary", {
      deptId,
      startDate,
      endDate,
    });
    summaryData.value = summaryResponse.data;

    // 고객 차트 데이터 요청
    const customerDataResponse = await axiosInstance.post(
      "/dashboard/customers/chart-data",
      {
        deptId,
        startDate,
        endDate,
        period: type.toUpperCase(),
      }
    );
    chartData.value = customerDataResponse.data;

    // 대기 시간 데이터 요청
    const waitTimeRequest = {
      type: type.toUpperCase(),
      startDate: formatDateTime(startDate),
      endDate: formatDateTime(endDate),
      deptId,
    };

    const waitTimeResponse = await axiosInstance.post(
      "/dashboard/average",
      waitTimeRequest
    );

    // 응답 데이터가 배열인지 확인하고 할당
    if (waitTimeResponse.data && Array.isArray(waitTimeResponse.data)) {
      waitTimeData.value = waitTimeResponse.data;
    } else {
      console.warn("예상치 못한 응답 데이터 구조:", waitTimeResponse.data);
      waitTimeData.value = []; // 응답이 예상한 형태가 아니면 빈 배열 할당
    }
  } catch (error) {
    console.error("대시보드 데이터를 가져오는 중 오류 발생:", error);
    if (error.response) {
      console.error("에러 상세:", error.response.data);
    }
  }
}

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}T${String(
    date.getHours()
  ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(
    date.getSeconds()
  ).padStart(2, "0")}`;
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: row;
}

.info-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem;
}

.dropdown-container,
.date-picker-container,
.filter-container,
.date-range-display {
  margin-bottom: 1rem;
}

/* Updated Button Style */
.styled-button {
  background-color: #2d2d44; /* Dark color to match the theme */
  color: #ffffff;
  padding: 0.8rem 1.2rem;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
  width: 8rem;
}

.styled-button:hover {
  background-color: #3c3c5c;
}

.styled-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
}

/* Updated Select Style */
.styled-select {
  background-color: #2d2d44;
  color: #ffffff;
  border: none;
  padding: 0.5rem;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
}

/* Updated Grid Layout Style */
.grid-layout {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.grid-item {
  background-color: #1a1a2e;
  color: #ffffff;
  border-radius: 8px;
  padding: 2%;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.2);
}
</style>
