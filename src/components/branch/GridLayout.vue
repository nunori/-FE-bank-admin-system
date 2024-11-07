<template>
  <div class="grid-layout" :style="gridContainerStyle">
    <!-- 그리드 셀 -->
    <div v-for="row in gridHeight" :key="`row-${row}`" class="grid-row">
      <div
        v-for="col in gridWidth"
        :key="`cell-${row}-${col}`"
        class="grid-cell"
        @dragover.prevent
        @drop="handleDrop($event, { row: row - 1, col: col - 1 })"
        @dragenter.prevent
      >
        <!-- 요소가 있는 경우 표시 -->
        <div
          v-if="getElementAtPosition(row - 1, col - 1)"
          class="grid-element"
          :class="getElementClass(getElementAtPosition(row - 1, col - 1))"
        >
          {{ getElementAtPosition(row - 1, col - 1).elementName }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  gridWidth: {
    type: Number,
    required: true,
  },
  gridHeight: {
    type: Number,
    required: true,
  },
  elements: {
    type: Array,
    default: () => [],
  },
});

// 그리드 컨테이너 스타일
const gridContainerStyle = computed(() => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  aspectRatio: `${props.gridWidth} / ${props.gridHeight}`,
  backgroundColor: "#f5f5f5",
  gap: "1px",
}));

// 특정 위치의 요소 찾기
const getElementAtPosition = (row, col) => {
  return props.elements.find(
    (element) => element.elementGridX === col && element.elementGridY === row
  );
};

// 요소 타입에 따른 클래스 반환
const getElementClass = (element) => ({
  "element-window": element.elementType === "WINDOW",
  "element-entrance": element.elementType === "ENTRANCE",
  "element-room": element.elementType === "ROOM",
  "element-wall": element.elementType === "WALL",
});

// 드롭 이벤트 처리
const handleDrop = (event, position) => {
  const elementData = JSON.parse(
    event.dataTransfer.getData("application/json")
  );
  emit("element-dropped", { ...elementData, ...position });
};
</script>

<style scoped>
.grid-layout {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
  background-color: #f5f5f5;
}

.grid-row {
  display: flex;
  flex: 1;
  gap: 1px;
}

.grid-cell {
  flex: 1;
  aspect-ratio: 1;
  background-color: white;
  border: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.grid-cell:hover {
  background-color: #f0f0f0;
}

.grid-element {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  color: white;
}

.element-window {
  background-color: #81c784;
}

.element-entrance {
  background-color: #64b5f6;
}

.element-room {
  background-color: #ffb74d;
}

.element-wall {
  background-color: #90a4ae;
}
</style>
