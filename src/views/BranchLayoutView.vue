<template>
  <div class="branch-layout-view">
    <div class="header">
      <h2>영업점 창구 배치도</h2>
      <div class="floor-control">
        <FloorSelector @floor-selected="handleFloorSelected" />
      </div>
    </div>

    <div class="content">
      <div class="left-panel">
        <ElementPalette :current-floor="selectedFloor" />
      </div>

      <div class="layout-container">
        <GridLayout
          :dept-id="Number(currentDeptId)"
          :floor-number="Number(currentFloorNumber)"
          :elements="elements"
          @element-dropped="handleElementDrop"
          @grid-size-changed="handleGridSizeChanged"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import FloorSelector from "@/components/branch/FloorSelector.vue";
import ElementPalette from "@/components/branch/ElementPalette.vue";
import GridLayout from "@/components/branch/GridLayout.vue";
import axiosInstance from "@/axios.js";
import { useUserStore } from "@/stores/userStore";

const userStore = useUserStore();
const selectedFloor = ref(null);
const elements = ref([]);
const gridWidth = ref(20);
const gridHeight = ref(15);

const currentDeptId = ref(userStore.userDeptId);
const currentFloorNumber = ref(1); // 현재 층 번호
const layoutElements = ref([]); // 레이아웃 요소들

const deptId = ref(1);
const floorNumber = ref(1);

watch(
  [currentDeptId, currentFloorNumber],
  ([newDeptId, newFloorNumber]) => {
    console.log("BranchLayoutView에서 변경 감지:", newDeptId, newFloorNumber);
  },
  { immediate: true }
);

const handleFloorSelected = (floor) => {
  selectedFloor.value = floor;
  // currentDeptId와 currentFloorNumber 업데이트
  currentDeptId.value = floor.deptId;
  currentFloorNumber.value = floor.floorNumber;
  console.log("층 변경 감지:", floor, "현재 층:", currentFloorNumber.value);
  fetchElements();
};
// const handleFloorSelected = (floor) => {
//   selectedFloor.value = floor;
//   fetchElements();
//   deptId.value = floor.deptId;
//   floorNumber.value = floor.floorNumber;
//   console.log("층 변경 감지:", floor); // 변경된 층 정보 확인
// };

const handleElementDrop = async (droppedElement) => {
  try {
    console.log("elementId:", droppedElement.elementId);
    console.log("elementGridX:", droppedElement.elementGridX);
    console.log("elementGridY:", droppedElement.elementGridY);
    console.log("elementColor:", droppedElement.elementColor || "#FFFFFF");

    // layoutElements를 업데이트하여 새로운 요소 위치 반영
    layoutElements.value = layoutElements.value.map((el) =>
      el.elementId === droppedElement.elementId ? droppedElement : el
    );

    await axiosInstance.put("/branch-layout/update", {
      elementId: droppedElement.elementId,
      elementGridX: droppedElement.elementGridX,
      elementGridY: droppedElement.elementGridY,
      elementColor: droppedElement.elementColor || "#FFFFFF",
      elementType: droppedElement.elementType || "window",
      elementHeight: droppedElement.elementHeight || 1,
      elementWidth: droppedElement.elementWidth || 1,
      elementName: droppedElement.elementName || "이름 미지정",
    });

    await fetchElements();
  } catch (error) {
    console.error("요소 위치 업데이트 실패:", error);
  }
};

const handleGridSizeChanged = ({ width, height }) => {
  gridWidth.value = width;
  gridHeight.value = height;
};

const fetchElements = async () => {
  if (!selectedFloor.value) return;

  try {
    const response = await axiosInstance.post("/branch-layout/getElements", {
      deptId: userStore.userDeptId,
      floorNumber: selectedFloor.value.floorNumber,
    });
    elements.value = response.data;
  } catch (error) {
    console.error("요소 목록 조회 실패:", error);
  }
};
</script>

<style scoped>
.branch-layout-view {
  padding: 2rem;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content {
  display: flex;
  gap: 2rem;
  flex: 1;
}

.left-panel {
  width: 250px;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.right-panel {
  flex: 1;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.no-floor {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 1.2rem;
}

h2 {
  margin: 0;
  color: #333;
}
</style>
