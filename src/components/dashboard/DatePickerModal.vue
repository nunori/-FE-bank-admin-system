<template>
  <div v-if="showModal" class="modal-overlay">
    <div class="modal-content">
      <h2>날짜 선택</h2>
      <div>
        <label>시작 날짜</label>
        <datepicker v-model="startDate" :format="dateFormat"></datepicker>
      </div>
      <div>
        <label>끝나는 날짜</label>
        <datepicker v-model="endDate" :format="dateFormat"></datepicker>
      </div>
      <button @click="confirmDate">확인</button>
      <button @click="closeModal">취소</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Datepicker from "vue3-datepicker";

const props = defineProps({
  showModal: Boolean,
  onDateSelected: Function,
});
const emit = defineEmits();
const startDate = ref(null);
const endDate = ref(null);
const dateFormat = "yyyy-MM-dd";

const confirmDate = () => {
  if (startDate.value && endDate.value) {
    props.onDateSelected({
      startDate: startDate.value,
      endDate: endDate.value,
    });
    closeModal();
  }
};

const closeModal = () => {
  startDate.value = null;
  endDate.value = null;
  emit("close");
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
}
</style>
