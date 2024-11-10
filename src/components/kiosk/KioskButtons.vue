<template>
  <div class="kiosk-buttons">
    <div class="header">
      <h2 class="title">키오스크 버튼 관리</h2>
      <button class="create-button" @click="showCreateModal = true">
        + 버튼 추가
      </button>
    </div>

    <div class="items-container">
      <div
        v-for="(item, index) in items"
        :key="item.buttonId"
        class="item"
        draggable="true"
        @dragstart="onDragStart(index)"
        @dragover.prevent
        @drop="onDrop(index)"
        @click="openEditModal(item)"
      >
        <div class="item-content">
          <input
            type="checkbox"
            v-model="item.visible"
            @change="updatePreview"
            class="checkbox"
            @click.stop
          />
          <span class="item-name">{{ item.buttonName }}</span>
          <div class="item-actions">
            <span class="drag-handle">⋮⋮</span>
            <button class="delete-button" @click.stop="confirmDelete(item)">
              <span class="delete-icon">×</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <button class="apply-button" @click="applyChanges">변경사항 저장</button>

    <!-- 버튼 생성 모달 -->
    <div v-if="showCreateModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <h3>새 버튼 추가</h3>
        <div class="form-group">
          <label>버튼 이름</label>
          <input
            v-model="newButton.buttonName"
            type="text"
            placeholder="버튼 이름을 입력하세요"
          />
        </div>
        <div class="form-group">
          <label>
            <input type="checkbox" v-model="newButton.visible" />
            버튼 표시
          </label>
        </div>
        <div class="modal-actions">
          <button class="cancel-button" @click="closeModal">취소</button>
          <button class="create-button" @click="createButton">생성</button>
        </div>
      </div>
    </div>

    <!-- 버튼 수정 모달 -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
      <div class="modal" @click.stop>
        <h3>버튼 수정</h3>
        <div class="form-group">
          <label>버튼 이름</label>
          <input
            v-model="editingButton.buttonName"
            type="text"
            placeholder="버튼 이름을 입력하세요"
          />
        </div>
        <div class="form-group">
          <label>
            <input type="checkbox" v-model="editingButton.visible" />
            버튼 표시
          </label>
        </div>
        <div class="modal-actions">
          <button class="cancel-button" @click="closeEditModal">취소</button>
          <button class="save-button" @click="saveButtonEdit">저장</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/userStore";
import { useKioskButtonStore } from "@/stores/kioskButtonStore";
import axiosInstance from "@/axios.js";

const userStore = useUserStore();
const kioskButtonStore = useKioskButtonStore();

const items = ref([]);
const showCreateModal = ref(false);
const showEditModal = ref(false);
let draggedIndex = null;

const newButton = ref({
  buttonName: "",
  visible: true,
});

const editingButton = ref({
  buttonId: null,
  buttonName: "",
  visible: true,
  position: 0,
});

const fetchButtonData = async () => {
  const deptId = userStore.userDeptId;
  try {
    const response = await axiosInstance.get(`/kiosk/buttons/${deptId}`);
    items.value = response.data.map((item) => ({
      ...item,
      name: item.buttonName,
      visible: item.visible !== undefined ? item.visible : true,
      position: item.buttonPosition,
    }));
    console.log("초기 버튼 정보:", items.value);
    kioskButtonStore.updateVisibility(items.value);
  } catch (error) {
    console.error("버튼 정보를 가져오는 중 오류 발생:", error);
  }
};

const onDragStart = (index) => {
  draggedIndex = index;
};

const onDrop = (targetIndex) => {
  if (draggedIndex === null) return;

  const draggedItem = items.value[draggedIndex];
  items.value.splice(draggedIndex, 1);
  items.value.splice(targetIndex, 0, draggedItem);

  updatePreview();
  draggedIndex = null;
};

const updatePreview = () => {
  kioskButtonStore.updateVisibility(items.value);
};

const closeModal = () => {
  showCreateModal.value = false;
  newButton.value = {
    buttonName: "",
    visible: true,
  };
};

const createButton = async () => {
  if (!newButton.value.buttonName.trim()) {
    alert("버튼 이름을 입력해주세요.");
    return;
  }

  try {
    const payload = {
      deptId: parseInt(userStore.userDeptId),
      buttonName: newButton.value.buttonName,
      buttonPosition: items.value.length + 1,
      visible: newButton.value.visible,
      updatedBy: userStore.userNumber,
    };

    await axiosInstance.post("/kiosk/buttons/create", payload);
    await fetchButtonData();
    closeModal();
    alert("버튼이 생성되었습니다.");
  } catch (error) {
    console.error("버튼 생성 중 오류 발생:", error);
    alert("버튼 생성에 실패했습니다.");
  }
};

const openEditModal = (item) => {
  editingButton.value = {
    buttonId: item.buttonId,
    buttonName: item.buttonName,
    visible: item.visible,
    position: item.position,
  };
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  editingButton.value = {
    buttonId: null,
    buttonName: "",
    visible: true,
    position: 0,
  };
};

const saveButtonEdit = async () => {
  if (!editingButton.value.buttonName.trim()) {
    alert("버튼 이름을 입력해주세요.");
    return;
  }

  try {
    const updatedButton = {
      deptId: parseInt(userStore.userDeptId),
      buttonId: editingButton.value.buttonId,
      position: editingButton.value.position,
      visible: editingButton.value.visible,
      buttonName: editingButton.value.buttonName,
    };

    await axiosInstance.put("/kiosk/buttons/update", [updatedButton]);

    // 로컬 데이터 업데이트
    const index = items.value.findIndex(
      (item) => item.buttonId === editingButton.value.buttonId
    );
    if (index !== -1) {
      items.value[index] = {
        ...items.value[index],
        buttonName: editingButton.value.buttonName,
        visible: editingButton.value.visible,
      };
    }

    updatePreview();
    closeEditModal();
    alert("수정되었습니다.");
  } catch (error) {
    console.error("버튼 수정 중 오류 발생:", error);
    alert("수정에 실패했습니다.");
  }
};

const confirmDelete = async (item) => {
  if (confirm("정말 이 버튼을 삭제하시겠습니까?")) {
    try {
      await axiosInstance.delete(`/kiosk/buttons/delete/${item.buttonId}`);
      await fetchButtonData();
      alert("버튼이 삭제되었습니다.");
    } catch (error) {
      console.error("버튼 삭제 중 오류 발생:", error);
      alert("삭제에 실패했습니다.");
    }
  }
};

const applyChanges = async () => {
  try {
    const payload = items.value.map((item, index) => ({
      deptId: parseInt(userStore.userDeptId),
      buttonId: item.buttonId,
      position: index + 1,
      visible: item.visible,
    }));

    await axiosInstance.put("/kiosk/buttons/update", payload);
    alert("저장되었습니다.");
  } catch (error) {
    console.error("변경사항 저장 중 오류 발생:", error);
    alert("저장에 실패했습니다.");
  }
};

onMounted(() => {
  fetchButtonData();
});
</script>

<style scoped>
.kiosk-buttons {
  background: white;
  border-radius: 2rem;
  padding: 1rem;
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.1);
  width: 80%;
  height: 90dvh;
}

.title {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 2rem;
  font-weight: 600;
}

.items-container {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 8px;
  margin-bottom: 20px;
}

.item {
  background: white;
  border-radius: 0.375rem;
  margin-bottom: 0.5rem;
  transition: all 0.2s ease;
  cursor: move;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.05);
}

.item:hover {
  transform: translateY(-0.125rem);
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
}

.item-content {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
}

.checkbox {
  margin-right: 0.75rem;
  width: 1.125rem; /* 18px */
  height: 1.125rem;
  cursor: pointer;
}

.item-name {
  flex-grow: 1;
  font-size: 1rem;
  color: #2c3e50;
}

.drag-handle {
  color: #a0aec0;
  cursor: move;
  user-select: none;
}

.apply-button {
  width: 100%;
  padding: 12px;
  background-color: #36d198;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.apply-button:hover {
  background-color: #45a049;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.create-button {
  padding: 8px 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.create-button:hover {
  background-color: #2980b9;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  width: 90%;
  max-width: 31.25rem; /* 500px */
  box-shadow: 0 0.25rem 0.375rem rgba(0, 0, 0, 0.1);
}

.modal h3 {
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.form-group input[type="text"] {
  width: 100%;
  padding: 0.5rem;
  border: 0.0625rem solid #ddd; /* 1px */
  border-radius: 0.25rem;
  font-size: 1rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.cancel-button {
  padding: 8px 16px;
  background-color: #95a5a6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-button:hover {
  background-color: #7f8c8d;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-group input[type="checkbox"] {
  width: 1.125rem; /* 18px */
  height: 1.125rem;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.delete-button {
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.delete-button:hover {
  background-color: #fde2e2;
}

.delete-icon {
  font-size: 1.2rem;
  font-weight: bold;
}
.delete-confirm-button {
  padding: 8px 16px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.delete-confirm-button:hover {
  background-color: #c0392b;
}

/* 모달 내 문구 스타일 */
.modal p {
  margin-bottom: 1rem;
  color: #2c3e50;
}

@media (max-width: 64rem) {
  /* 1024px */
  .kiosk-buttons {
    min-height: auto;
  }

  .modal {
    width: 95%;
    max-width: 100%;
    padding: 1.5rem;
  }
}

@media (max-width: 48rem) {
  /* 768px */
  .header {
    flex-direction: column;
    gap: 1rem;
  }

  .title {
    margin-bottom: 1rem;
  }
}

/* 작은 모바일 화면 대응 */
@media (max-width: 30rem) {
  /* 480px */
  .kiosk-buttons {
    padding: 1.5rem;
  }

  .item-content {
    padding: 0.5rem;
  }
}
</style>
