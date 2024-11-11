<template>
  <div class="dropdown">
    <label for="branch-select">지점 선택:</label>
    <select
      id="branch-select"
      v-model="selectedBranch"
      @change="emitBranchChange"
    >
      <option
        v-for="branch in branches"
        :key="branch.dept_id"
        :value="branch.dept_id"
      >
        {{ branch.dept_name }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axiosInstance from "@/axios.js";

const branches = ref([]); // branches 리스트
const selectedBranch = ref(null);
const emit = defineEmits(["branch-change"]);

function emitBranchChange() {
  emit("branch-change", selectedBranch.value);
}

onMounted(async () => {
  try {
    const response = await axiosInstance.get("/dashboard/branches");
    branches.value = response.data;
    selectedBranch.value = branches.value[0]?.dept_id; // 첫 번째 지점을 기본 선택값으로 설정
    emitBranchChange(); // 초기 선택값 emit
  } catch (error) {
    console.error("지점 데이터를 가져오는 중 오류 발생:", error);
  }
});
</script>

<style scoped>
label {
  margin-right: 10px;
  font-weight: bold;
}

select {
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
}
</style>
