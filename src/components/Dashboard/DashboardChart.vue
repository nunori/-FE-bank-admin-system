<script>
import StatsCard from "@/components/StatsCard.vue";
import CustomerList from "@/components/CustomerList.vue";
</script>

<template>
  <div class="dashboard">
    <StatsCard title="내점 고객 수" :data="dailyVisitData" />
    <StatsCard title="대기시간 평균" :data="waitingTimeData" />
    <StatsCard title="시간별 내점 고객 수" :data="hourlyVisitData" />
    <CustomerList :customers="customers" />
  </div>
</template>

<style scoped></style>
