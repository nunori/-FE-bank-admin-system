<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const userid = ref("");
const password = ref("");
const router = useRouter();

const handleLogin = () => {
  if (userid.value && password.value) {
    router.push("/dashboard");
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
      <input type="text" placeholder="비밀번호" v-model="password" required />
      <button type="submit">로그인</button>
    </form>
  </div>
</template>

<style scoped></style>
