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
import axiosInstance from "@/axios.js"; // axios 인스턴스 가져오기

const branches = ref([]); // 초기 branches 빈 배열
const selectedBranch = ref(null);
const emit = defineEmits(["branch-change"]);

function emitBranchChange() {
  emit("branch-change", selectedBranch.value);
}
// 컴포넌트가 로드될 때 branches 데이터 가져오기
onMounted(async () => {
  try {
    const response = await axiosInstance.get("/dashboard/branches");
    branches.value = response.data; // dept_id와 dept_name 필드가 포함된 데이터
    selectedBranch.value = branches.value[0]?.dept_id; // 첫 번째 지점을 기본 선택값으로 설정
  } catch (error) {
    console.error("지점 데이터를 가져오는 중 오류 발생:", error);
  }
});

function handleSelection() {
  console.log(`Selected Branch ID: ${selectedBranch.value}`);
  // 추가 API 요청이나 데이터 업데이트 로직 추가 가능
}
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
