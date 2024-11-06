<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axiosInstance from "@/axios.js";
import { useUserStore } from "@/stores/userStore";

const userid = ref("");
const password = ref("");
const router = useRouter();
const userStore = useUserStore();

const handleLogin = async () => {
  if (userid.value && password.value) {
    try {
      const response = await axiosInstance.post(`/auth/login`, {
        userNumber: userid.value,
        userPassword: password.value,
      });

      console.log("전체응답: ", response.data);

      const {
        accessToken,
        refreshToken,
        deptId,
        deptCode, // 새로 추가
        userName,
        userNumber,
        dvcd, // 새로 추가
      } = response.data;

      console.log("accessToken: ", accessToken);
      console.log("refreshToken: ", refreshToken);
      console.log("부서 ID: ", deptId);
      console.log("부서 코드: ", deptCode);
      console.log("사용자 이름: ", userName);
      console.log("행번: ", userNumber);
      console.log("업무구분코드: ", dvcd);

      // 토큰 저장
      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      // 사용자 정보 스토어에 저장
      userStore.setUserName(userName);
      userStore.setUserNumber(userNumber);
      userStore.setUserDeptId(deptId);
      userStore.setUserDeptCode(deptCode); // 새로 추가 (스토어에 해당 메서드 추가 필요)
      userStore.setUserDvcd(dvcd); // 새로 추가 (스토어에 해당 메서드 추가 필요)

      // 로컬 스토리지에 사용자 정보 저장
      localStorage.setItem("userName", userName);
      localStorage.setItem("userNumber", userNumber);
      localStorage.setItem("userDeptId", deptId);
      localStorage.setItem("userDeptCode", deptCode);
      localStorage.setItem("userDvcd", dvcd);

      // 부서 코드에 따른 라우팅
      if (deptCode === "01") {
        // deptId -> deptCode로 변경
        router.push("/dashboard");
      } else if (deptCode === "02") {
        // deptId -> deptCode로 변경
        router.push("/kiosk/ticket-custom");
      } else {
        alert("권한이 없습니다.");
      }
    } catch (e) {
      console.error("로그인 오류: ", e);
      if (e.response?.data?.message) {
        alert(e.response.data.message);
      } else {
        alert("로그인에 실패했습니다. 다시 시도해주세요.");
      }
    }
  } else {
    alert("아이디와 비밀번호를 입력하세요.");
  }
};
</script>

<template>
  <div class="login">
    <h2>로그인</h2>
    <form @submit.prevent="handleLogin" class="login-form">
      <div class="form-group">
        <input
          type="text"
          placeholder="사번 (7자리)"
          v-model="userid"
          required
          maxlength="7"
        />
      </div>
      <div class="form-group">
        <input
          type="password"
          placeholder="비밀번호 (8자리 이상)"
          v-model="password"
          required
          minlength="8"
        />
      </div>
      <button type="submit">로그인</button>
    </form>
  </div>
</template>

<style scoped>
.login {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  width: 100%;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

input:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.3);
}

button {
  background-color: #4caf50;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
}

button:hover {
  background-color: #45a049;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}
</style>
