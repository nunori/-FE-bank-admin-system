<template>
  <div class="layout-controls">
    <div class="control-group">
      <h3>레이아웃 관리</h3>
      <div class="buttons">
        <button class="control-btn save" @click="$emit('save')">
          저장하기
        </button>
        <button class="control-btn reset" @click="confirmReset">초기화</button>
      </div>
    </div>

    <div class="control-group">
      <h3>템플릿</h3>
      <div class="buttons">
        <select v-model="selectedTemplate" class="template-select">
          <option value="">템플릿 선택</option>
          <option
            v-for="template in templates"
            :key="template.id"
            :value="template.id"
          >
            {{ template.name }}
          </option>
        </select>
        <button
          class="control-btn load"
          :disabled="!selectedTemplate"
          @click="$emit('load-template', selectedTemplate)"
        >
          불러오기
        </button>
        <button class="control-btn save-as" @click="saveAsTemplate">
          현재 배치 템플릿으로 저장
        </button>
      </div>
    </div>

    <div class="control-group">
      <h3>자동 최적화</h3>
      <div class="buttons">
        <button class="control-btn optimize" @click="$emit('optimize')">
          배치 최적화
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  templates: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits([
  "save",
  "reset",
  "optimize",
  "load-template",
  "save-template",
]);

const selectedTemplate = ref("");

const confirmReset = () => {
  if (confirm("현재 배치를 모두 초기화하시겠습니까?")) {
    emit("reset");
  }
};

const saveAsTemplate = async () => {
  const templateName = prompt("템플릿 이름을 입력하세요:");
  if (templateName) {
    emit("save-template", templateName);
  }
};
</script>

<style scoped>
.layout-controls {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.control-group h3 {
  font-size: 1rem;
  color: #333;
  margin: 0;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.control-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.save {
  background-color: #4caf50;
  color: white;
}

.reset {
  background-color: #f44336;
  color: white;
}

.load {
  background-color: #2196f3;
  color: white;
}

.save-as {
  background-color: #9c27b0;
  color: white;
}

.optimize {
  background-color: #ff9800;
  color: white;
}

.template-select {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.control-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.control-btn:hover:not(:disabled) {
  filter: brightness(1.1);
}
</style>
