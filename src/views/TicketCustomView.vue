<script setup>
import Sidebar from "@/components/Sidebar.vue";
import TicketCustom from "@/components/ticket/TicketCustom.vue";
import TicketPreview from "@/components/ticket/TicketPreview.vue";
</script>

<template>
  <div class="ticket-container">
    <div class="main-content">
      <div class="ticket-layout">
        <TicketPreview />
        <TicketCustom />
      </div>
    </div>
  </div>
</template>

<style scoped>
.ticket-container {
  display: flex;
  min-height: 100vh;
  max-width: 100vw;
  overflow: hidden;
  background-color: #f0f2f5;
}

.main-content {
  flex: 1;
  padding: 20px;
  min-width: 0; /* 자식 요소가 넘치는 것을 방지 */
}

.ticket-layout {
  display: flex;
  flex-direction: row;
  gap: 24px;
  max-width: 100%;
  margin: 0 auto;
}

/* 반응형 디자인 */
@media (max-width: 1400px) {
  .ticket-layout {
    gap: 16px;
  }
}

@media (max-width: 1200px) {
  .sidebar {
    flex: 0 0 200px;
  }
}
</style>
