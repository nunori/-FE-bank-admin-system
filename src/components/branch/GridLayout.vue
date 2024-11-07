<template>
  <div class="grid-controls">
    <div class="grid-size-controls">
      <div class="size-input">
        <label>가로</label>
        <div class="input-with-buttons">
          <button @click="decreaseWidth">-</button>
          <input
            v-model.number="localGridWidth"
            type="number"
            min="5"
            max="30"
          />
          <button @click="increaseWidth">+</button>
        </div>
      </div>
      <div class="size-input">
        <label>세로</label>
        <div class="input-with-buttons">
          <button @click="decreaseHeight">-</button>
          <input
            v-model.number="localGridHeight"
            type="number"
            min="5"
            max="30"
          />
          <button @click="increaseHeight">+</button>
        </div>
      </div>
      <button class="apply-btn" @click="applyGridSize">적용</button>
    </div>
  </div>

  <div class="grid-container">
    <div
      class="grid-layout"
      :style="{
        gridTemplateColumns: `repeat(${localGridWidth}, 1fr)`,
        gridTemplateRows: `repeat(${localGridHeight}, 1fr)`,
      }"
    >
      <template v-for="row in localGridHeight" :key="`row-${row}`">
        <div
          v-for="col in localGridWidth"
          :key="`cell-${row}-${col}`"
          class="grid-cell"
          @dragover.prevent
          @drop="handleDrop($event, { row: row - 1, col: col - 1 })"
          @dragenter.prevent
        >
          <template v-if="getElementAtPosition(row - 1, col - 1)">
            <div
              class="grid-element"
              :class="getElementClass(getElementAtPosition(row - 1, col - 1))"
              :style="getElementStyle(getElementAtPosition(row - 1, col - 1))"
            >
              {{ getElementAtPosition(row - 1, col - 1).elementName }}
            </div>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";

const emit = defineEmits(["element-dropped", "grid-size-changed"]);

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

const localGridWidth = ref(props.gridWidth);
const localGridHeight = ref(props.gridHeight);

watch(
  () => props.gridWidth,
  (newWidth) => {
    localGridWidth.value = newWidth;
  }
);

watch(
  () => props.gridHeight,
  (newHeight) => {
    localGridHeight.value = newHeight;
  }
);

const increaseWidth = () => {
  if (localGridWidth.value < 30) localGridWidth.value++;
};

const decreaseWidth = () => {
  if (localGridWidth.value > 5) localGridWidth.value--;
};

const increaseHeight = () => {
  if (localGridHeight.value < 30) localGridHeight.value++;
};

const decreaseHeight = () => {
  if (localGridHeight.value > 5) localGridHeight.value--;
};

const applyGridSize = () => {
  emit("grid-size-changed", {
    width: localGridWidth.value,
    height: localGridHeight.value,
  });
};

const getElementAtPosition = (row, col) => {
  return props.elements.find((element) => {
    const elementEndX = element.elementGridX + element.elementWidth;
    const elementEndY = element.elementGridY + element.elementHeight;

    return (
      col >= element.elementGridX &&
      col < elementEndX &&
      row >= element.elementGridY &&
      row < elementEndY
    );
  });
};

const getElementStyle = (element) => {
  if (!element) return {};

  return {
    backgroundColor: element.elementColor,
    gridColumn: `span ${element.elementWidth}`,
    gridRow: `span ${element.elementHeight}`,
  };
};

const getElementClass = (element) => ({
  "element-window": element.elementType === "WINDOW",
  "element-entrance": element.elementType === "ENTRANCE",
  "element-room": element.elementType === "ROOM",
  "element-wall": element.elementType === "WALL",
});

const handleDrop = (event, position) => {
  const elementData = JSON.parse(
    event.dataTransfer.getData("application/json")
  );

  if (
    position.col + elementData.elementWidth > props.gridWidth ||
    position.row + elementData.elementHeight > props.gridHeight
  ) {
    alert("요소가 그리드 범위를 벗어납니다.");
    return;
  }

  const hasCollision = checkCollision(
    position.row,
    position.col,
    elementData.elementWidth,
    elementData.elementHeight
  );

  if (hasCollision) {
    alert("다른 요소와 겹칠 수 없습니다.");
    return;
  }

  emit("element-dropped", {
    ...elementData,
    elementGridX: position.col,
    elementGridY: position.row,
  });
};

const checkCollision = (row, col, width, height) => {
  for (let i = row; i < row + height; i++) {
    for (let j = col; j < col + width; j++) {
      if (getElementAtPosition(i, j)) {
        return true;
      }
    }
  }
  return false;
};
</script>

<style scoped>
.grid-controls {
  margin-bottom: 1rem;
}

.grid-size-controls {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
}

.size-input {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-with-buttons {
  display: flex;
  gap: 0.5rem;
}

.input-with-buttons input {
  width: 60px;
  text-align: center;
}

.grid-container {
  width: 100%;
  padding-bottom: 100%;
  position: relative;
  z-index: 1;
}

.grid-layout {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: grid;
  gap: 1px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.grid-cell {
  position: relative;
  background: white;
  border: 1px solid #eee;
}

.grid-cell::before {
  content: "";
  display: block;
  padding-bottom: 100%;
}

.grid-element {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
  padding: 4px;
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

.apply-btn {
  height: fit-content;
}
</style>
