<!-- // Dashboard.vue -->
<script setup>
import { onMounted } from "vue";
import axios from "axios";

const makeSecureRequest = async () => {
  const token = localStorage.getItem("token"); // 로컬 스토리지에서 토큰 가져오기

  try {
    const response = await axios.get("http://localhost:8080/api/protected", {
      headers: {
        Authorization: `Bearer ${token}`, // Authorization 헤더에 Bearer 토큰 포함
      },
    });
    console.log("보호된 데이터: ", response.data);
  } catch (error) {
    console.error("보호된 요청 오류: ", error);
  }
};

// 페이지가 로드될 때 보호된 API를 호출
onMounted(() => {
  makeSecureRequest();
});
</script>

<template>
  <div>
    <h2>대시보드</h2>
    <!-- 보호된 데이터 표시 -->
  </div>
</template>

<style scoped></style>
