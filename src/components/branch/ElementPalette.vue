<template>
  <div class="element-palette">
    <div class="palette-header">
      <h3>요소 목록</h3>
      <button
        @click="openCreateModal"
        class="add-element-btn"
        :disabled="!currentFloor"
      >
        + 요소 추가
      </button>
    </div>

    <div class="element-list">
      <div
        v-for="element in elements"
        :key="element.elementId"
        class="element-item"
        draggable="true"
        @dragstart="handleDragStart($event, element)"
      >
        <div
          class="element-preview"
          :style="{
            backgroundColor: element.elementColor || '#ffffff',
            width: `${element.elementWidth * 40}px`, // 기본 단위 40px
            height: `${element.elementHeight * 40}px`,
            minWidth: '40px',
            margin: '0 auto',
          }"
        >
          <span class="element-label">{{ element.elementName }}</span>
          <br />
          <span class="element-size"
            >{{ element.elementWidth }}x{{ element.elementHeight }}</span
          >
        </div>
        <div class="element-info">
          <span class="element-type">{{ element.elementTypeDescription }}</span>
          <div class="element-actions">
            <button @click.stop="openEditModal(element)" class="edit-btn">
              <span>✎</span>
            </button>
            <button
              @click.stop="deleteElement(element.elementId)"
              class="delete-btn"
            >
              <span>×</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 모달 -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <h3>{{ isEditing ? "요소 수정" : "새 요소 추가" }}</h3>
        <!-- 현재 층 정보 표시 -->
        <div class="current-floor-info">
          현재 층: {{ currentFloor?.floorNumber }}층
          {{ currentFloor?.floorName ? `(${currentFloor.floorName})` : "" }}
        </div>

        <div class="form-group">
          <label>요소 이름</label>
          <input
            v-model="elementForm.elementName"
            type="text"
            placeholder="요소 이름을 입력하세요"
          />
        </div>
        <div class="form-group">
          <label>요소 타입</label>
          <select v-model="elementForm.elementType" @change="handleTypeChange">
            <option value="window">창구</option>
            <option value="wall">벽</option>
            <option value="entrance">입구</option>
          </select>
        </div>
        <div class="form-group">
          <label>크기</label>
          <div class="size-inputs">
            <div class="size-input">
              <label>가로</label>
              <input
                v-model.number="elementForm.elementWidth"
                type="number"
                min="1"
                max="5"
              />
            </div>
            <div class="size-input">
              <label>세로</label>
              <input
                v-model.number="elementForm.elementHeight"
                type="number"
                min="1"
                max="5"
              />
            </div>
          </div>
        </div>
        <div class="form-group">
          <label>색상</label>
          <input
            v-model="elementForm.elementColor"
            type="color"
            class="color-picker"
          />
        </div>
        <div class="modal-actions">
          <button class="cancel-btn" @click="closeModal">취소</button>
          <button
            class="confirm-btn"
            @click="isEditing ? updateElement() : createElement()"
          >
            {{ isEditing ? "수정" : "생성" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useUserStore } from "@/stores/userStore";
import axiosInstance from "@/axios.js";

const props = defineProps({
  currentFloor: {
    type: Object,
    default: () => ({
      floorId: null,
      floorNumber: null,
      floorName: "",
    }),
  },
});

const userStore = useUserStore();
const showModal = ref(false);
const isEditing = ref(false);
const elements = ref([]);
const elementForm = ref({
  elementName: "",
  elementType: "window",
  elementTypeDescription: "",
  elementWidth: 1,
  elementHeight: 1,
  elementColor: "#81C784",
  elementGridX: null,
  elementGridY: null,
});

// 요소 목록 조회 시 현재 층 정보 사용
const fetchElements = async () => {
  if (!props.currentFloor) return;

  try {
    const response = await axiosInstance.post("/branch-layout/getElements", {
      deptId: userStore.userDeptId,
      floorNumber: props.currentFloor.floorNumber,
    });
    elements.value = response.data;
  } catch (error) {
    console.error("요소 목록 조회 실패:", error);
    alert("요소 목록을 불러오는데 실패했습니다.");
  }
};

// 모달 열기 (생성)
const openCreateModal = () => {
  isEditing.value = false;
  elementForm.value = {
    elementName: "",
    elementType: "window",
    elementTypeDescription: "창구",
    elementWidth: 1,
    elementHeight: 1,
    elementColor: "#81C784",
    elementGridX: null,
    elementGridY: null,
  };
  showModal.value = true;
};

// 모달 열기 (수정)
const openEditModal = (element) => {
  isEditing.value = true;
  elementForm.value = { ...element };
  showModal.value = true;
};

// 모달 닫기
const closeModal = () => {
  showModal.value = false;
};

// 층 변경 시 요소 목록 갱신
watch(
  () => props.currentFloor,
  (newFloor) => {
    if (newFloor?.floorNumber) {
      fetchElements();
    } else {
      elements.value = [];
    }
  },
  { immediate: true }
);
// 요소 생성
// 요소 생성 시 현재 층 정보 포함
const createElement = async () => {
  try {
    if (!props.currentFloor) {
      alert("층을 선택해주세요.");
      return;
    }

    if (!elementForm.value.elementName) {
      alert("요소 이름을 입력해주세요.");
      return;
    }

    const payload = {
      deptId: userStore.userDeptId,
      floorNumber: props.currentFloor.floorNumber, // 현재 선택된 층 번호
      elementName: elementForm.value.elementName,
      elementType: elementForm.value.elementType,
      elementWidth: elementForm.value.elementWidth,
      elementHeight: elementForm.value.elementHeight,
      elementColor: elementForm.value.elementColor,
      elementGridX: elementForm.value.elementGridX,
      elementGridY: elementForm.value.elementGridY,
    };

    await axiosInstance.post("/branch-layout/create", payload);
    await fetchElements();
    closeModal();
    alert("요소가 생성되었습니다.");
  } catch (error) {
    console.error("요소 생성 실패:", error);
    alert("요소 생성에 실패했습니다.");
  }
};

// 요소 수정
const updateElement = async () => {
  try {
    if (!elementForm.value.elementName) {
      alert("요소 이름을 입력해주세요.");
      return;
    }

    const payload = {
      elementId: elementForm.value.elementId,
      elementName: elementForm.value.elementName,
      elementType: elementForm.value.elementType,
      elementWidth: elementForm.value.elementWidth,
      elementHeight: elementForm.value.elementHeight,
      elementColor: elementForm.value.elementColor,
      elementGridX: elementForm.value.elementGridX,
      elementGridY: elementForm.value.elementGridY,
    };

    await axiosInstance.put("/branch-layout/update", payload);
    await fetchElements();
    closeModal();
    alert("요소가 수정되었습니다.");
  } catch (error) {
    console.error("요소 수정 실패:", error);
    alert("요소 수정에 실패했습니다.");
  }
};

// 요소 삭제
const deleteElement = async (elementId) => {
  if (!confirm("정말 이 요소를 삭제하시겠습니까?")) return;

  try {
    await axiosInstance.delete(`/branch-layout/delete/${elementId}`);
    await fetchElements();
    alert("요소가 삭제되었습니다.");
  } catch (error) {
    console.error("요소 삭제 실패:", error);
    alert("요소 삭제에 실패했습니다.");
  }
};

// 요소 타입 변경 시 기본 색상 설정
const handleTypeChange = () => {
  switch (elementForm.value.elementType) {
    case "window":
      elementForm.value.elementColor = "#81C784"; // 초록색
      elementForm.value.elementTypeDescription = "창구";
      break;
    case "entrance":
      elementForm.value.elementColor = "#64B5F6"; // 파란색
      elementForm.value.elementTypeDescription = "입구";
      break;
    case "wall":
      elementForm.value.elementColor = "#90A4AE"; // 회색
      elementForm.value.elementTypeDescription = "벽";
      break;
  }
};

// 드래그 시작
const handleDragStart = (event, element) => {
  event.dataTransfer.setData(
    "application/json",
    JSON.stringify({
      ...element,
      isNew: false,
    })
  );
};

// 컴포넌트 마운트 시 요소 목록 조회
onMounted(() => {
  if (props.floorNumber) {
    fetchElements();
  }
});
</script>

<style scoped>
.element-palette {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  width: 100%;
}

.palette-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.add-element-btn {
  padding: 0.5rem 1rem;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.element-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.element-item {
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 0.5rem;
  cursor: move;
  background: white;
}

.element-preview {
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  text-align: center;
  font-weight: 500;
}

.element-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.element-type {
  font-size: 0.875rem;
  color: #666;
}

.element-actions {
  display: flex;
  gap: 0.25rem;
}

.edit-btn,
.delete-btn {
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.edit-btn {
  background: #2196f3;
  color: white;
}

.delete-btn {
  background: #f44336;
  color: white;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 400px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
}

.form-group input[type="text"],
.form-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.size-inputs {
  display: flex;
  gap: 1rem;
}

.size-input {
  flex: 1;
}

.size-input label {
  font-size: 0.875rem;
  color: #666;
}

.color-picker {
  width: 100%;
  height: 40px;
  padding: 0;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.cancel-btn,
.confirm-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn {
  background: #9e9e9e;
  color: white;
}

.confirm-btn {
  background: #4caf50;
  color: white;
}
</style>
