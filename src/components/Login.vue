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
  if (!userid.value?.trim() || !password.value?.trim()) {
    alert("아이디와 비밀번호를 입력하세요.");
    return;
  }

  try {
    const response = await axiosInstance.post(`/auth/login`, {
      userNumber: userid.value.trim(),
      userPassword: password.value.trim(),
    });

    const userData = response.data;
    console.log("전체응답: ", response.data);

    if (!userData.accessToken) {
      throw new Error("인증 토큰이 없습니다.");
    }

    // 토큰 저장
    localStorage.setItem("accessToken", userData.accessToken);
    userData.refreshToken &&
      localStorage.setItem("refreshToken", userData.refreshToken);

    // 사용자 정보 저장
    const userInfo = {
      userName: userData.userName,
      userNumber: userData.userNumber,
      userDeptId: userData.deptId,
      userDeptCode: userData.deptCode,
      userDvcd: userData.dvcd,
    };

    // Store에 저장
    Object.entries(userInfo).forEach(([key, value]) => {
      if (value) {
        userStore[`set${key.charAt(0).toUpperCase() + key.slice(1)}`](value);
        localStorage.setItem(key, value);
      }
    });

    // 라우팅
    switch (userData.deptCode) {
      case "01":
        console.log("라우팅 시도 01 - dashboard");
        await router.push("/dashboard");
        console.log("dashboard 라우팅 완료");
        break;
      case "02":
        console.log("라우팅 시도 02 - ticket-custom");
        await router.push("/kiosk/ticket-custom");
        console.log("ticket-custom 라우팅 완료");
        break;
      default:
        console.log("알 수 없는 deptCode:", userData.deptCode);
        alert("권한이 없습니다.");
        return; // 함수 즉시 종료kio
    }
  } catch (error) {
    console.error("로그인 오류:", error);
    if (error.name === "NavigationFailure") {
      console.error("라우팅 실패:", error);
      // 라우팅 실패 시 홈으로 이동
      await router.push("/home");
    }
    const errorMessage =
      error.response?.data?.message ||
      "로그인에 실패했습니다. 다시 시도해주세요.";
    alert(errorMessage);
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
