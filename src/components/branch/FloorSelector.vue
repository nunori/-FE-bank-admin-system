<template>
  <div class="floor-selector">
    <label>층 선택:</label>
    <select v-model="selectedFloor" @change="handleChange">
      <option v-for="floor in floors" :key="floor.id" :value="floor.number">
        {{ floor.number }}층
      </option>
    </select>
    <button @click="addFloor" class="add-floor-btn">층 추가</button>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: Number,
  floors: Array,
});

const emit = defineEmits(["update:modelValue"]);
const selectedFloor = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newVal) => {
    selectedFloor.value = newVal;
  }
);

const handleChange = () => {
  emit("update:modelValue", selectedFloor.value);
};

const floorNumber = ref("");
const floorName = ref("");
const deptId = ref("");

const addFloor = async () => {
  try {
    const response = await axiosInstance.post("/floors", {
      deptId: deptId.value,
      floorNumber: floorNumber.value,
      floorName: floorName.value ? floorName.value : "",
    });

    if (response.status == 201) {
      console.log("층이 성공적으로 추가되었습니다.", response.data);

      floorName = "";
      floorNumber = "";
      deptId.value = "";
    } else {
      console.error("층 추가 실패", response);
    }
  } catch (e) {
    console.error(e);
  }
};
</script>

<style scoped>
.floor-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
}

select {
  padding: 0.5rem;
  border-radius: 4px;
}

.add-floor-btn {
  padding: 0.5rem 1rem;
  background-color: #9c27b0;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
