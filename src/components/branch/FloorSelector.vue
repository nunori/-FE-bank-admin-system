<template>
  <div class="floor-controls">
    <div class="floor-buttons">
      <button
        v-for="floor in floors"
        :key="floor.floorNumber"
        class="floor-button"
        :class="{ active: selectedFloor === floor.floorNumber }"
        @click="selectFloor(floor)"
      >
        {{ floor.floorName || `${floor.floorNumber}층` }}
      </button>
    </div>
    <button class="add-floor-btn" @click="openAddFloorModal">층 추가</button>

    <!-- 층 추가 모달 -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h3>층 추가</h3>
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
          <button @click="createFloor" class="create-btn">생성</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/userStore";
import axiosInstance from "@/axios.js";

const userStore = useUserStore();
const floors = ref([]);
const selectedFloor = ref(null);
const showModal = ref(false);
const newFloor = ref({
  floorNumber: null,
  floorName: "",
});

const emit = defineEmits(["floor-selected"]);

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
  selectedFloor.value = floor.floorNumber;
  emit("floor-selected", {
    floorId: floor.floorId,
    floorNumber: floor.floorNumber,
    floorName: floor.floorName,
  });
};

// 모달 제어
const openAddFloorModal = () => {
  showModal.value = true;
  newFloor.value = {
    floorNumber: null,
    floorName: "",
  };
};

const closeModal = () => {
  showModal.value = false;
};

// 층 생성
const createFloor = async () => {
  try {
    const payload = {
      deptId: userStore.userDeptId,
      floorNumber: newFloor.value.floorNumber,
      floorName: newFloor.value.floorName,
    };

    const response = await axiosInstance.post(
      "/branch-layout/floors/create",
      payload
    );
    await fetchFloors();
    closeModal();
    alert("층이 생성되었습니다.");
  } catch (error) {
    if (error.response?.data) {
      alert(error.response.data);
    } else {
      alert("층 생성에 실패했습니다.");
    }
    console.error("층 생성 실패:", error);
  }
};

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
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  background: white;
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
