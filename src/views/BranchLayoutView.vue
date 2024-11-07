<template>
  <div class="branch-layout-container">
    <div class="layout-controls">
      <FloorSelector v-model="currentFloor" :floors="floors" />
      <div class="actions">
        <button @click="saveLayout" class="save-btn">저장</button>
        <button @click="optimizeLayout" class="optimize-btn">
          배치 최적화
        </button>
      </div>
    </div>

    <div class="layout-content">
      <WindowPalette class="layout-sidebar" />
      <GridLayout
        :current-floor="currentFloor"
        :windows="windows"
        @update:layout="handleLayoutUpdate"
      />
    </div>

    <!-- <TemplateControl
      :templates="templates"
      @load="loadTemplate"
      @save="saveTemplate"
    /> -->
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/userStore";
import FloorSelector from "@/components/branch/FloorSelector.vue";
import WindowPalette from "@/components/branch/WindowPalette.vue";
import GridLayout from "@/components/branch/GridLayout.vue";
import TemplateControl from "@/components/branch/TemplateControl.vue";

const userStore = useUserStore();
const currentFloor = ref(1);
const floors = ref([]);
const windows = ref([]);
const templates = ref([]);

const fetchFloorData = async () => {
  // API 호출 로직
};

const saveLayout = async () => {
  // 저장 로직
};

const optimizeLayout = async () => {
  // 최적화 로직
};

onMounted(() => {
  fetchFloorData();
});
</script>

<style scoped>
.branch-layout-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.layout-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.layout-content {
  display: flex;
  gap: 1rem;
  min-height: 600px;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.save-btn {
  background-color: #4caf50;
  color: white;
}

.optimize-btn {
  background-color: #2196f3;
  color: white;
}
</style>
