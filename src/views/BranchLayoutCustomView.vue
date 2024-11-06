<script setup>
import Sidebar from "@/components/Sidebar.vue";
import BranchLayout from "@/components/branch/BranchLayout.vue";
</script>
<template>
  <div class="branch-layout-container">
    <Sidebar />
    <BranchLayout />
  </div>
</template>
<style scoped>
.branch-layout-container {
  display: flex;
  flex-direction: row;
}
</style>
