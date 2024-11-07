<template>
  <div class="template-control">
    <div class="template-header">
      <h3>템플릿 관리</h3>
      <button class="save-template-btn" @click="showSaveDialog">
        현재 배치 템플릿으로 저장
      </button>
    </div>

    <div class="template-list" v-if="templates.length > 0">
      <div
        v-for="template in templates"
        :key="template.id"
        class="template-item"
      >
        <div class="template-info">
          <span class="template-name">{{ template.name }}</span>
          <span class="template-date">{{
            formatDate(template.createdAt)
          }}</span>
        </div>

        <div class="template-actions">
          <button class="preview-btn" @click="previewTemplate(template)">
            미리보기
          </button>
          <button class="load-btn" @click="loadTemplate(template)">
            불러오기
          </button>
          <button class="delete-btn" @click="confirmDelete(template)">
            삭제
          </button>
        </div>
      </div>
    </div>

    <div v-else class="no-templates">저장된 템플릿이 없습니다.</div>

    <!-- 템플릿 저장 모달 -->
    <div v-if="showSaveModal" class="modal-overlay">
      <div class="modal">
        <h4>템플릿 저장</h4>
        <input
          v-model="newTemplateName"
          placeholder="템플릿 이름을 입력하세요"
          class="template-name-input"
        />
        <div class="modal-actions">
          <button class="cancel-btn" @click="showSaveModal = false">
            취소
          </button>
          <button
            class="confirm-btn"
            @click="saveTemplate"
            :disabled="!newTemplateName"
          >
            저장
          </button>
        </div>
      </div>
    </div>

    <!-- 템플릿 미리보기 모달 -->
    <div v-if="showPreviewModal" class="modal-overlay">
      <div class="modal preview-modal">
        <h4>템플릿 미리보기</h4>
        <div class="preview-content">
          <!-- 미리보기 내용 -->
          <div class="layout-preview">
            <div
              v-for="window in previewTemplate.layout"
              :key="window.id"
              class="window-preview"
              :style="getWindowStyle(window)"
            >
              {{ window.number }}
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button class="close-btn" @click="showPreviewModal = false">
            닫기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { format } from "date-fns";

const props = defineProps({
  templates: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["load", "save", "delete"]);

const showSaveModal = ref(false);
const showPreviewModal = ref(false);
const newTemplateName = ref("");
const previewTemplateData = ref(null);

const formatDate = (date) => {
  return format(new Date(date), "yyyy.MM.dd HH:mm");
};

const showSaveDialog = () => {
  newTemplateName.value = "";
  showSaveModal.value = true;
};

const saveTemplate = () => {
  emit("save", newTemplateName.value);
  showSaveModal.value = false;
};

const loadTemplate = (template) => {
  if (confirm(`"${template.name}" 템플릿을 불러오시겠습니까?`)) {
    emit("load", template);
  }
};

const openPreview = (template) => {
  previewTemplateData.value = template;
  showPreviewModal.value = true;
};

const confirmDelete = (template) => {
  if (confirm(`"${template.name}" 템플릿을 삭제하시겠습니까?`)) {
    emit("delete", template.id);
  }
};

const getWindowStyle = (window) => {
  return {
    left: `${window.x * 50}px`,
    top: `${window.y * 50}px`,
    backgroundColor: getWindowColor(window.type),
  };
};

const getWindowColor = (type) => {
  const colors = {
    NORMAL: "#81C784",
    LOAN: "#64B5F6",
    ENTERPRISE: "#FFB74D",
  };
  return colors[type] || "#ccc";
};
</script>

<style scoped>
.template-control {
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.template-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.template-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.template-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid #eee;
  border-radius: 4px;
}

.template-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.template-name {
  font-weight: 500;
}

.template-date {
  font-size: 0.875rem;
  color: #666;
}

.template-actions {
  display: flex;
  gap: 0.5rem;
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
  padding: 1.5rem;
  border-radius: 8px;
  min-width: 300px;
}

.preview-modal {
  min-width: 500px;
  min-height: 400px;
}

.layout-preview {
  position: relative;
  width: 100%;
  height: 300px;
  border: 1px solid #ddd;
  margin: 1rem 0;
}

.window-preview {
  position: absolute;
  width: 48px;
  height: 48px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 500;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.save-template-btn {
  background-color: #9c27b0;
  color: white;
}

.preview-btn {
  background-color: #2196f3;
  color: white;
}

.load-btn {
  background-color: #4caf50;
  color: white;
}

.delete-btn {
  background-color: #f44336;
  color: white;
}
</style>
