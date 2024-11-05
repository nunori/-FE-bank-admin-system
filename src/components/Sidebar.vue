<script setup>
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/userStore";

const router = useRouter();
const userStore = useUserStore();

function navigateTo(path) {
  router.push(path);
}
</script>

<template>
  <div class="sidebar">
    <div class="user-info">
      <div class="avatar"></div>
      <div class="user-details">
        <div class="name">{{ userStore.userName }}</div>
        <div class="number">{{ userStore.userNumber }}</div>
      </div>
    </div>
    <nav class="menu">
      <ul>
        <li @click="navigateTo('/dashboard')" class="active">대시보드</li>
        <li @click="navigateTo('/kiosk-buttons')">키오스크 버튼</li>
        <li @click="navigateTo('/kiosk-order')">키오스크 순번표</li>
        <li @click="navigateTo('/branch-layout')">영업점 창구 배치도</li>
      </ul>
    </nav>
  </div>
</template>

<style scoped>
.sidebar {
  width: 250px;
  background-color: #1a1a2e; /* 다크 배경색 */
  color: #ffffff; /* 텍스트 흰색 */
  height: 100vh;
  padding: 20px;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.5); /* 더 뚜렷한 그림자 */
  display: flex;
  flex-direction: column; /* 세로 방향 정렬 */
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #333; /* 더 어두운 회색 */
  margin-right: 10px;
}

.user-details {
  display: flex;
  flex-direction: column; /* 수직 정렬 */
}

.name {
  font-size: 18px;
  font-weight: bold;
  color: #e0e0e0; /* 밝은 회색 텍스트 */
}

.number {
  font-size: 14px; /* 폰트 크기를 조금 줄여서 구분 */
  color: #b0b0b0; /* 기본 텍스트 색상 */
}

.menu {
  flex-grow: 1;
}

.menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu li {
  cursor: pointer;
  padding: 10px;
  border-radius: 5px;
  transition: background-color 0.2s;
  color: #b0b0b0; /* 기본 텍스트 색상 */
}

.menu li:hover {
  background-color: #2a2a3d; /* 호버 시 밝은 다크 색상 */
}

.menu li.active {
  background-color: #3a3a5e; /* 활성화된 메뉴 색상 */
  font-weight: bold;
  color: #ffffff; /* 활성화된 메뉴의 텍스트 색상 */
}
</style>
