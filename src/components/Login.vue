<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const userid = ref("");
const password = ref("");
const router = useRouter();
const URL = "http://localhost:8080/api";

const handleLogin = async () => {
  if (userid.value && password.value) {
    try {
      const response = await axios.post(`${URL}/auth/login`, {
        userNumber: userid.value,
        userPassword: password.value,
      });

      console.log("전체응답: ", response.data);

      const accessToken = response.data.accessToken;
      const refreshToken = response.data.refreshToken;
      console.log("accessToken: ", accessToken);
      console.log("refreshToken: ", refreshToken);

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      const deptId = response.data.deptId;
      console.log("부서 ID: ", deptId);

      if (deptId === "01") {
        router.push("/dashboard");
      } else if (deptId === "02") {
        router.push("/kiosk");
      } else {
        alert("권한이 없습니다.");
      }
    } catch (e) {
      console.error("로그인 오류: ", e);
      alert("로그인에 실패했습니다. 다시 시도해주세요.");
    }
  } else {
    alert("아이디와 비밀번호를 입력하세요.");
  }
};
</script>

<template>
  <div class="login">
    <h2>로그인</h2>
    <form @submit.prevent="handleLogin">
      <input type="text" placeholder="사번" v-model="userid" required />
      <input
        type="password"
        placeholder="비밀번호"
        v-model="password"
        required
      />
      <button type="submit">로그인</button>
    </form>
  </div>
</template>

<style scoped></style>
