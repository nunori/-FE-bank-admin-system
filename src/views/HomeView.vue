<script setup>
import Login from "@/components/Login.vue";
</script>

<template>
  <div class="home">
    <h1>환영합니다!</h1>
    <p>이곳은 고객 관리 키오스크 관리자 시스템입니다.</p>
    <Login />
    <router-link to="/register">회원가입 페이지로 이동</router-link>
  </div>
</template>

<style scoped>
.home {
  text-align: center;
  padding: 20px;
}

h1 {
  color: #333;
  margin-bottom: 16px;
}

p {
  color: #666;
  font-size: 16px;
}
</style>
