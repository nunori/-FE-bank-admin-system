<script setup>
import Sidebar from "@/components/Sidebar.vue";
import KioskButtons from "@/components/kiosk/KioskButtons.vue";
import KioskButtonPreview from "@/components/kiosk/KioskButtonPreview.vue";
</script>

<template>
  <div class="page-container">
    <Sidebar />
    <div class="main-content">
      <KioskButtonPreview />
      <KioskButtons />
    </div>
  </div>
</template>

<style scoped>
.page-container {
  display: flex;
  flex-direction: row;
}

.main-content {
  display: flex;
  flex-direction: row;
}
</style>
