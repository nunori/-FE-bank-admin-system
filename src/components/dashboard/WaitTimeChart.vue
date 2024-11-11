<template>
  <div class="chart-container">
    <div
      v-if="!props.waitTimeData || props.waitTimeData.length === 0"
      class="no-data-message"
    >
      데이터가 없습니다.
    </div>
    <canvas v-else ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import Chart from "chart.js/auto";

const props = defineProps({
  waitTimeData: {
    type: Array,
    required: true,
    default: () => [],
    validator: (value) => {
      console.log("Validating waitTimeData:", value);
      return (
        Array.isArray(value) &&
        value.every(
          (item) =>
            item.hasOwnProperty("period") && item.hasOwnProperty("avgWaitTime")
        )
      );
    },
  },
  period: {
    type: String,
    required: true,
    validator: (value) => {
      console.log("Validating period:", value);
      return ["custom", "day", "month", "year"].includes(value.toLowerCase());
    },
  },
});

const chartCanvas = ref(null);
let chart = null;

// Props 변화 감지를 위한 watch
watch(
  () => props.waitTimeData,
  (newData) => {
    console.log("waitTimeData changed:", newData);
  },
  { immediate: true, deep: true }
);

watch(
  () => props.period,
  (newPeriod) => {
    console.log("period changed:", newPeriod);
  },
  { immediate: true }
);

const getChartConfig = () => {
  console.log("Generating chart config with data:", props.waitTimeData);
  const getLabels = () => {
    switch (props.period.toUpperCase()) {
      case "DAY":
        return props.waitTimeData.map((d) => d.period);
      case "MONTH":
        return props.waitTimeData.map((d) => `${parseInt(d.period)}월`);
      case "YEAR":
        return props.waitTimeData.map((d) => d.period);
      default:
        return props.waitTimeData.map((d) => d.period);
    }
  };

  const labels = getLabels();
  const data = props.waitTimeData.map((d) => d.avgWaitTime);
  console.log("Chart labels:", labels);
  console.log("Chart data:", data);

  return {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "평균 대기 시간 (분)",
          data: data,
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
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.raw.toFixed(1)}분`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: "#fff",
            callback: function (value) {
              return value + "분";
            },
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
  };
};

const updateChart = () => {
  console.log("Updating chart...");
  console.log("Canvas element:", chartCanvas.value);

  if (chart) {
    console.log("Destroying old chart");
    chart.destroy();
  }

  if (!chartCanvas.value) {
    console.error("Canvas reference를 찾을 수 없습니다.");
    return;
  }

  const ctx = chartCanvas.value.getContext("2d");
  const config = getChartConfig();
  console.log("Chart configuration:", config);

  chart = new Chart(ctx, config);
  console.log("New chart created");
};

// waitTimeData나 period가 변경될 때 차트 업데이트
watch(
  [() => props.waitTimeData, () => props.period],
  ([newData, newPeriod]) => {
    console.log("Watch triggered - Data:", newData, "Period:", newPeriod);
    if (newData && newData.length > 0) {
      updateChart();
    }
  },
  { deep: true }
);

onMounted(() => {
  console.log("Component mounted");
  console.log("Initial waitTimeData:", props.waitTimeData);
  console.log("Initial period:", props.period);
  console.log("chartCanvas:", chartCanvas.value);

  if (props.waitTimeData && props.waitTimeData.length > 0) {
    updateChart();
  }
});

onBeforeUnmount(() => {
  if (chart) {
    chart.destroy();
  }
});
</script>

<style scoped>
.chart-container {
  height: 300px;
  background-color: #1f1f36;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.no-data-message {
  color: #fff;
  font-size: 1.2rem;
}
</style>
