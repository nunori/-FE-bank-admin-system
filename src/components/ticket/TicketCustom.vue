<template>
  <div class="ticket-custom">
    <div class="header">
      <h2 class="title">번호표 버튼 관리</h2>
      <button class="create-button" @click="showCreateModal = true">
        + 버튼 추가
      </button>
    </div>

    <div class="items-container">
      <div
        v-for="(item, index) in items"
        :key="item.ticketButtonId"
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
          <span class="item-name">{{ item.name }}</span>
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
    <div v-if="showCreateModal" class="modal-overlay">
      <div class="modal">
        <h3>새 버튼 추가</h3>
        <div class="form-group">
          <label>버튼 이름 (관리용)</label>
          <input
            v-model="newButton.buttonName"
            type="text"
            placeholder="버튼 이름을 입력하세요"
          />
        </div>
        <div class="form-group">
          <label>표시될 텍스트</label>
          <textarea
            v-model="newButton.buttonDescription"
            placeholder="실제 화면에 표시될 텍스트를 입력하세요"
            rows="3"
          ></textarea>
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
  </div>

  <!-- 버튼 수정 모달 -->
  <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
    <div class="modal" @click.stop>
      <h3>버튼 수정</h3>
      <div class="form-group">
        <label>버튼 이름 (관리용)</label>
        <input
          v-model="editingButton.buttonName"
          type="text"
          placeholder="버튼 이름을 입력하세요"
        />
      </div>
      <div class="form-group">
        <label>표시될 텍스트</label>
        <textarea
          v-model="editingButton.buttonDescription"
          placeholder="실제 화면에 표시될 텍스트를 입력하세요"
          rows="3"
        ></textarea>
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

  <!-- 삭제 확인 모달 -->
  <div v-if="showDeleteModal" class="modal-overlay">
    <div class="modal">
      <h3>버튼 삭제</h3>
      <p>정말 이 버튼을 삭제하시겠습니까?</p>
      <div class="modal-actions">
        <button class="cancel-button" @click="showDeleteModal = false">
          취소
        </button>
        <button class="delete-confirm-button" @click="deleteButton">
          삭제
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/userStore";
import axiosInstance from "@/axios.js";
import { usePreviewStore } from "@/stores/previewStore";

const showEditModal = ref(false);
const editingButton = ref({
  ticketButtonId: null,
  buttonName: "",
  buttonDescription: "",
  visible: true,
  position: 0,
});

// 수정 모달 열기
const openEditModal = (item) => {
  editingButton.value = {
    ticketButtonId: item.ticketButtonId,
    buttonName: item.buttonName,
    buttonDescription: item.buttonDescription,
    visible: item.visible,
    position: item.position,
  };
  showEditModal.value = true;
};

// 수정 모달 닫기
const closeEditModal = () => {
  showEditModal.value = false;
  editingButton.value = {
    ticketButtonId: null,
    buttonName: "",
    buttonDescription: "",
    visible: true,
    position: 0,
  };
};

// 버튼 수정 저장
const saveButtonEdit = async () => {
  try {
    const updatedButton = {
      deptId: userStore.userDeptId,
      ticketButtonId: editingButton.value.ticketButtonId,
      buttonName: editingButton.value.buttonName,
      buttonDescription: editingButton.value.buttonDescription,
      position: editingButton.value.position,
      visible: editingButton.value.visible,
    };

    // 백엔드 API 호출
    await axiosInstance.put("/kiosk/ticket-layout/update", [updatedButton]);

    // 로컬 데이터 업데이트
    const index = items.value.findIndex(
      (item) => item.ticketButtonId === editingButton.value.ticketButtonId
    );
    if (index !== -1) {
      items.value[index] = {
        ...items.value[index],
        buttonName: editingButton.value.buttonName,
        buttonDescription: editingButton.value.buttonDescription,
        visible: editingButton.value.visible,
      };
    }

    // 프리뷰 업데이트
    updatePreview();

    closeEditModal();
    alert("수정되었습니다.");
  } catch (error) {
    console.error("버튼 수정 중 오류 발생:", error);
    alert("수정에 실패했습니다.");
  }
};

const showCreateModal = ref(false);
const newButton = ref({
  buttonName: "",
  buttonDescription: "",
  visible: true,
});

// 모달 닫기
const closeModal = () => {
  showCreateModal.value = false;
  newButton.value = {
    buttonName: "",
    visible: true,
  };
};

// 버튼 생성
const createButton = async () => {
  if (!newButton.value.buttonName.trim()) {
    alert("버튼 이름을 입력해주세요.");
    return;
  }

  if (!newButton.value.buttonDescription.trim()) {
    alert("표시될 텍스트를 입력해주세요.");
    return;
  }

  try {
    const payload = {
      deptId: parseInt(userStore.userDeptId),
      buttonName: newButton.value.buttonName,
      buttonDescription: newButton.value.buttonDescription,
      buttonPosition: items.value.length + 1,
      visible: newButton.value.visible,
      updatedBy: userStore.userNumber,
    };

    await axiosInstance.post("/kiosk/ticket-layout/create", payload);
    await fetchButtonData();
    closeModal();
  } catch (error) {
    console.error("버튼 생성 중 오류 발생:", error);
    alert("버튼 생성에 실패했습니다.");
  }
};

const showDeleteModal = ref(false);
const buttonToDelete = ref(null);

// 삭제 확인 모달 표시
const confirmDelete = (item) => {
  buttonToDelete.value = item;
  showDeleteModal.value = true;
};

// 버튼 삭제
const deleteButton = async () => {
  try {
    await axiosInstance.delete(
      `/kiosk/ticket-layout/delete/${buttonToDelete.value.ticketButtonId}`
    );
    await fetchButtonData(); // 데이터 새로고침
    showDeleteModal.value = false;
  } catch (error) {
    console.error("버튼 삭제 중 오류 발생:", error);
    alert("버튼 삭제에 실패했습니다.");
  }
};

const userStore = useUserStore();
const previewStore = usePreviewStore();

const items = ref([]); // 버튼 정보 목록을 저장할 배열
let draggedIndex = null;

// 초기 버튼 정보 가져오기
const fetchButtonData = async () => {
  const deptId = userStore.userDeptId;
  try {
    const response = await axiosInstance.get(`/kiosk/ticket-layout/${deptId}`);
    items.value = response.data.map((item) => ({
      ticketButtonId: item.ticketButtonId,
      name: item.buttonName || "이름 없음",
      buttonName: item.buttonName,
      buttonDescription: item.buttonDescription, // description 추가
      visible: item.visible !== undefined ? item.visible : true,
      position: item.buttonPosition,
    }));
    console.log("Fetched items:", items.value); // 디버깅용
    previewStore.updateVisibility(items.value);
  } catch (error) {
    console.error("버튼 정보를 가져오는 중 오류 발생:", error);
  }
};

// 드래그 시작 이벤트
const onDragStart = (index) => {
  draggedIndex = index;
};

// 드롭 이벤트
const onDrop = (targetIndex) => {
  if (draggedIndex === null) return;

  const draggedItem = items.value[draggedIndex];

  items.value.splice(draggedIndex, 1);
  items.value.splice(targetIndex, 0, draggedItem);

  updatePreview();
  draggedIndex = null;
};

// 미리보기 업데이트
const updatePreview = () => {
  previewStore.updateVisibility(items.value);
};

// 적용하기 버튼 클릭 이벤트 - PUT 요청
const applyChanges = async () => {
  const deptId = userStore.userDeptId;
  const payload = items.value.map((item, index) => ({
    deptId: deptId,
    ticketButtonId: item.ticketButtonId,
    position: index + 1,
    visible: item.visible,
  }));

  try {
    await axiosInstance.put("/kiosk/ticket-layout/update", payload);
    alert("저장되었습니다.");
  } catch (error) {
    console.error("변경사항 저장 중 오류 발생:", error);
    alert("저장에 실패했습니다.");
  }
};

// 컴포넌트가 마운트될 때 초기 버튼 정보 불러오기
onMounted(() => {
  fetchButtonData();
});
</script>

<style scoped>
.ticket-custom {
  background: white;
  border-radius: 2rem;
  padding: 3rem;
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.1);
  width: 100%; /* 변경: 고정 너비 제거 */
  margin: 0; /* 변경: margin 제거 */
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
  border-radius: 6px;
  margin-bottom: 8px;
  transition: all 0.2s ease;
  cursor: move;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.item-content {
  display: flex;
  align-items: center;
  padding: 12px 16px;
}

.checkbox {
  margin-right: 12px;
  width: 18px;
  height: 18px;
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
  background-color: #4caf50;
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
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
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
  width: 18px;
  height: 18px;
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
</style>
