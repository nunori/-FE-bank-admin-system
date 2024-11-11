<template>
  <div class="floor-controls">
    <!-- 창구 개수 표시 -->
    <div class="counter-summary">
      <h3>창구 개수: {{ counterCount }}</h3>
    </div>

    <div class="floor-buttons">
      <button
        v-for="floor in sortedFloors"
        :key="floor.floorNumber"
        class="floor-button"
        :class="{ active: selectedFloor === floor.floorNumber }"
        @click="selectFloor(floor)"
      >
        <span class="floor-name">
          {{ floor.floorName || `${floor.floorNumber}층` }}
        </span>
        <div class="menu-container">
          <svg
            @click.stop="toggleMenu(floor.floorId)"
            class="menu-icon"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <circle cx="8" cy="3" r="1.5" />
            <circle cx="8" cy="8" r="1.5" />
            <circle cx="8" cy="13" r="1.5" />
          </svg>
          <div v-if="openMenuId === floor.floorId" class="menu">
            <div @click.stop="openEditFloorModal(floor)" class="menu-item">
              <svg
                class="menu-item-icon"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                />
                <path
                  d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                />
              </svg>
              수정
            </div>
            <div @click.stop="deleteFloor(floor.floorId)" class="menu-item">
              <svg
                class="menu-item-icon"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M3 6h18" />
                <path
                  d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                />
              </svg>
              삭제
            </div>
          </div>
        </div>
      </button>
    </div>
    <button class="add-floor-btn" @click="openAddFloorModal">층 추가</button>

    <!-- 층 추가 모달 -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h3>{{ isEditing ? "층 수정" : "층 추가" }}</h3>
        <div class="form-group">
          <label>층 번호</label>
          <input
            v-model.number="newFloor.floorNumber"
            type="number"
            placeholder="층 번호 입력"
          />
        </div>
        <div class="form-group">
          <label>층 이름</label>
          <input
            v-model="newFloor.floorName"
            type="text"
            placeholder="층 이름 입력"
          />
        </div>
        <div class="modal-actions">
          <button @click="closeModal">취소</button>
          <button
            @click="isEditing ? updateFloor() : createFloor()"
            class="create-btn"
          >
            {{ isEditing ? "수정" : "생성" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "@/stores/userStore";
import axiosInstance from "@/axios.js";

const userStore = useUserStore();
const floors = ref([]);
const selectedFloor = ref(null);
const showModal = ref(false);
const isEditing = ref(false);
const openMenuId = ref(null);
const newFloor = ref({
  floorNumber: null,
  floorName: "",
});
const counterCount = ref(0); // 창구 개수 상태

const sortedFloors = computed(() => {
  return [...floors.value].sort((a, b) => a.floorNumber - b.floorNumber);
});

const emit = defineEmits(["floor-selected"]);

const fetchCounterCount = async (deptId, floorNumber) => {
  try {
    const response = await axiosInstance.post(`/branch-layout/window-count`, {
      deptId: deptId,
      floorNumber: floorNumber, // ensure that 'floorNumber' matches backend parameter
    });
    counterCount.value = response.data; // Adjust based on the backend's response format
  } catch (error) {
    console.error("창구 개수를 가져오는 중 오류 발생:", error);
  }
};

// 층 목록 조회
const fetchFloors = async () => {
  try {
    const response = await axiosInstance.get(
      `/branch-layout/floors/${userStore.userDeptId}`
    );
    floors.value = response.data;
    if (floors.value.length > 0 && !selectedFloor.value) {
      selectFloor(floors.value[0]);
    }
  } catch (error) {
    console.error("층 정보 조회 실패:", error);
  }
};

// 층 선택
const selectFloor = (floor) => {
  if (!floor || typeof floor.floorId === "undefined") {
    console.error("유효하지 않은 층 정보입니다:", floor);
    return;
  }
  selectedFloor.value = floor.floorNumber;
  fetchCounterCount(userStore.userDeptId, floor.floorNumber); // 창구 개수 요청
  emit("floor-selected", {
    deptId: userStore.userDeptId,
    floorId: floor.floorId,
    floorNumber: floor.floorNumber,
    floorName: floor.floorName,
  });
};

// 3점 아이콘 클릭 시 메뉴 토글
const toggleMenu = (floorId) => {
  if (!floorId) return;
  openMenuId.value = openMenuId.value === floorId ? null : floorId;
};

const openAddFloorModal = () => {
  isEditing.value = false;
  newFloor.value = {
    floorNumber: null,
    floorName: "",
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  isEditing.value = false;
  newFloor.value = {
    floorNumber: null,
    floorName: "",
  };
};

// 초기 데이터 가져오기
onMounted(() => {
  fetchFloors();
});
</script>

<style scoped>
.floor-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
}

.floor-buttons {
  display: flex;
  gap: 0.5rem;
}

.floor-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  background: white;
  min-width: 120px;
  position: relative;
}

.floor-button.active {
  background: #4caf50;
  color: white;
  border-color: #4caf50;
}

.add-floor-btn {
  padding: 0.5rem 1rem;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
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
  z-index: 15;
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
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}
</style>
