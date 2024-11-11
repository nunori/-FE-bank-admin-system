<script setup>
import Login from "@/components/Login.vue";
</script>

<template>
  <div class="home">
    <img src="@/assets/img/imbank_logo_2.jpg" alt="login_page_img" />
    <div class="login-right">
      <h1>환영합니다!</h1>
      <p>이곳은 고객 관리 키오스크 관리자 시스템입니다.</p>
      <Login />
      <router-link to="/register">회원가입 페이지로 이동</router-link>
    </div>
  </div>
</template>

<style scoped>
.home {
  padding: 20px;
  display: flex;
  flex-direction: row;
  background-color: #ffffff;
  min-height: 100dvh;
  align-items: center;
  gap: 2rem;
}

.home img {
  max-height: 30dvh;
  width: 50%; /* 이미지 영역이 전체의 50% 차지 */
}

.login-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 50%; /* login-right 영역이 전체의 50% 차지 */
}

h1 {
  color: #333;
  margin-bottom: 16px;
}

p {
  color: #666;
  font-size: 16px;
}

@media screen and (max-width: 60%) {
  .home {
    flex-direction: column;
  }

  .home img,
  .login-right {
    width: 100%; /* 작은 화면에서는 둘 다 전체 너비 사용 */
  }
}
</style>
