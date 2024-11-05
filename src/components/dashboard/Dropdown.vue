<template>
  <div class="dropdown">
    <label for="branch-select">지점 선택:</label>
    <select
      id="branch-select"
      v-model="selectedBranch"
      @change="handleSelection"
    >
      <option v-for="branch in branches" :key="branch.id" :value="branch.id">
        {{ branch.name }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref } from "vue";

const branches = [
  { id: "01", name: "서울 지점" },
  { id: "02", name: "부산 지점" },
  { id: "03", name: "대구 지점" },
];

const selectedBranch = ref(branches[0].id); // 기본값 설정

function handleSelection() {
  // 선택된 지점의 ID를 콘솔에 출력 (나중에 이걸로 데이터를 가져올 수 있음)
  console.log(`Selected Branch ID: ${selectedBranch.value}`);
  // API 요청이나 데이터를 업데이트하는 로직을 추가하면 됨
}
</script>

<style scoped>
.dropdown {
  margin-bottom: 20px;
}

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
