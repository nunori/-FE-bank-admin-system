<template>
  <div class="grid-wrapper">
    <div class="grid-controls">
      <!-- 그리드 사이즈 조절 UI -->
      <div class="grid-size-controls">
        <div class="size-input">
          <label>가로</label>
          <div class="input-with-buttons">
            <button @click="decreaseWidth" class="control-btn">-</button>
            <input
              v-model.number="localGridWidth"
              type="number"
              min="5"
              max="100"
              class="grid-input"
            />
            <button @click="increaseWidth" class="control-btn">+</button>
          </div>
        </div>
        <div class="size-input">
          <label>세로</label>
          <div class="input-with-buttons">
            <button @click="decreaseHeight" class="control-btn">-</button>
            <input
              v-model.number="localGridHeight"
              type="number"
              min="5"
              max="30"
              class="grid-input"
            />
            <button @click="increaseHeight" class="control-btn">+</button>
          </div>
        </div>
        <button class="apply-btn" @click="applyGridSize">적용</button>
      </div>
    </div>
  </div>

  <div class="grid-container">
    <!-- 그리드 레이아웃 -->
    <div
      class="grid-layout"
      :style="{
        gridTemplateColumns: `repeat(${localGridWidth}, 1fr)`,
        gridTemplateRows: `repeat(${localGridHeight}, 1fr)`,
      }"
    >
      <!-- 각 셀에 요소가 있는지 확인 후 표시 -->
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
              <!-- 요소의 중앙 셀에만 이름 표시 -->
              <template
                v-if="
                  isCenterOfElement(
                    row - 1,
                    col - 1,
                    getElementAtPosition(row - 1, col - 1)
                  )
                "
              >
                {{ getElementAtPosition(row - 1, col - 1).elementName }}
              </template>
            </div>
          </template>
        </div>
      </template>
      <!-- <template v-for="row in localGridHeight" :key="`row-${row}`">
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
      </template> -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { createToaster } from "@meforma/vue-toaster";
import axiosInstance from "@/axios";

const toast = createToaster();
const emit = defineEmits(["element-dropped", "grid-size-changed"]);

const props = defineProps({
  deptId: {
    type: Number,
    required: true,
  },
  floorNumber: {
    type: Number,
    required: true,
  },
  elements: {
    type: Array,
    default: () => [],
  },
});

const localGridWidth = ref(10);
const localGridHeight = ref(10);

// Grid size API 호출
const loadGridSize = async () => {
  console.log("적용 중인 층:", props.deptId, props.floorNumber); // props가 올바르게 전달되었는지 확인

  try {
    const response = await axiosInstance.post(`/branch-layout/grid/size`, {
      deptId: props.deptId,
      floorNumber: props.floorNumber,
    });

    if (response.status === 200) {
      // 받아온 데이터를 localGridWidth와 localGridHeight에 반영
      localGridWidth.value = response.data.width;
      localGridHeight.value = response.data.height;
      console.log(
        "로딩된 그리드 크기:",
        localGridWidth.value,
        localGridHeight.value
      ); // 확인 로그 추가
      emit("grid-size-changed", response.data); // 데이터 변경 후 이벤트 발생
    }
  } catch (error) {
    console.error("그리드 크기 조회 실패:", error);
    toast.error("그리드 크기를 불러오는데 실패했습니다.");
  }
};

// 그리드 크기 적용
const applyGridSize = async () => {
  try {
    console.log("적용 중인 층:", props.deptId, props.floorNumber);
    const response = await axiosInstance.put(`/branch-layout/grid/size`, {
      deptId: props.deptId,
      floorNumber: props.floorNumber,
      width: localGridWidth.value,
      height: localGridHeight.value,
    });

    if (response.status === 200) {
      emit("grid-size-changed", response.data);
      toast.success("그리드 크기가 저장되었습니다.");
    }
  } catch (error) {
    let errorMessage = "그리드 크기를 저장하는 중 오류가 발생했습니다.";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    toast.error(errorMessage);
  }
};

const isCenterOfElement = (row, col, element) => {
  const centerX = element.elementGridX + Math.floor(element.elementWidth / 2);
  const centerY = element.elementGridY + Math.floor(element.elementHeight / 2);
  return row === centerY && col === centerX;
};

// 가로/세로 크기 조절 함수들
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

const getElementAtPosition = (row, col) => {
  const element = props.elements.find((element) => {
    const elementEndX = element.elementGridX + element.elementWidth;
    const elementEndY = element.elementGridY + element.elementHeight;
    return (
      col >= element.elementGridX &&
      col < elementEndX &&
      row >= element.elementGridY &&
      row < elementEndY
    );
  });

  // if (!element) {
  //   console.log(`No element found at position row:${row}, col:${col}`);
  // } else {
  //   console.log(`Element found at row:${row}, col:${col} - `, element);
  // }

  return element;
};

// 드롭된 요소에 대한 스타일 지정
const getElementStyle = (element) => {
  if (!element) return {};

  console.log("getElementStyle 실행");

  return {
    backgroundColor: element.elementColor, // 요소의 색상을 적용
    gridColumn: `span ${element.elementWidth}`, // 요소의 너비만큼 셀을 차지하도록 설정
    gridRow: `span ${element.elementHeight}`, // 요소의 높이만큼 셀을 차지하도록 설정
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "bold",
  };
};

// 요소에 대한 클래스 지정
const getElementClass = (element) => ({
  "element-window": element.elementType === "WINDOW",
  "element-entrance": element.elementType === "ENTRANCE",
  "element-room": element.elementType === "ROOM",
  "element-wall": element.elementType === "WALL",
});

// 드래그 앤 드롭 핸들러 - 요소를 그리드 상의 드롭된 위치에 배치
const handleDrop = (event, position) => {
  const elementData = JSON.parse(
    event.dataTransfer.getData("application/json")
  );

  if (
    position.col + elementData.elementWidth > localGridWidth.value ||
    position.row + elementData.elementHeight > localGridHeight.value
  ) {
    toast.error("요소가 그리드 범위를 벗어납니다.");
    return;
  }

  // 충돌 체크
  if (
    checkCollision(
      position.row,
      position.col,
      elementData.elementWidth,
      elementData.elementHeight
    )
  ) {
    toast.error("다른 요소와 겹칠 수 없습니다.");
    return;
  }

  emit("element-dropped", {
    ...elementData,
    elementGridX: position.col,
    elementGridY: position.row,
  });
};

// 다른 요소와 충돌 체크
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

// props 변경 감지
// watch(() => props.deptId, loadGridSize);
// watch(() => props.floorNumber, loadGridSize);
watch(
  () => [props.deptId, props.floorNumber],
  async ([newDeptId, newFloorNumber]) => {
    // deptId와 floorNumber가 정의되어 있는 경우에만 동작
    if (newDeptId != null && newFloorNumber != null) {
      await loadGridSize(); // deptId와 floorNumber 변경 시 그리드 크기 로드
    }
  },
  { immediate: true }
);
watch(
  () => [props.deptId, props.floorNumber],
  async () => {
    console.log("층 변경 감지:", props.deptId, props.floorNumber); // 층 변경 감지 로그
    await loadGridSize(); // deptId와 floorNumber 변경 시 그리드 크기 로드
  },
  { immediate: true }
);

// 요소 리스트가 변경될 때마다 다시 렌더링
watch(
  () => props.elements,
  (newElements) => {
    // 필요에 따라 local state로 복사하여 사용 가능
    console.log("요소 업데이트:", newElements);
  },
  { immediate: true, deep: true }
);

// 컴포넌트 마운트 시 그리드 크기 로드
onMounted(loadGridSize);
</script>

<style scoped>
.grid-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100px;
}
.grid-controls {
  position: sticky;
  top: 0;
  z-index: 11;
  padding: 1rem;
  background-color: white;
  display: flex;
  justify-content: center; /* 가운데 정렬 */
  width: 100%;
}

.grid-size-controls {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  max-width: 1200px;
  width: 90%;
  flex-wrap: wrap;
  justify-content: center; /* 내부 요소들도 가운데 정렬 */
}

.size-input {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-with-buttons {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.grid-input {
  width: 60px;
  text-align: center;
  padding: 0.25rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.control-btn {
  padding: 0.25rem 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f5f5f5;
  cursor: pointer;
}

.control-btn:hover {
  background-color: #e0e0e0;
}

.apply-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
  height: fit-content;
}

.apply-btn:hover {
  background-color: #45a049;
}

.grid-container {
  position: sticky;
  width: 100%;
  top: 3rem;
  padding-bottom: 100%;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.grid-layout {
  position: absolute;
  top: 10;
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
</style>
