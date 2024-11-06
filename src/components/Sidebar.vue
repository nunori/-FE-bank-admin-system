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
        <li
          @click="handleNavigation('/dashboard', '01')"
          :class="{ active: isActive('/dashboard') }"
        >
          대시보드
        </li>
        <li
          @click="handleNavigation('/kiosk/buttons', '02')"
          :class="{ active: isActive('/kiosk/buttons') }"
        >
          키오스크 버튼
        </li>
        <li
          @click="handleNavigation('/kiosk/ticket-custom', '02')"
          :class="{ active: isActive('/kiosk/ticket-custom') }"
        >
          키오스크 순번표
        </li>
        <li
          @click="handleNavigation('/branch-layout', '02')"
          :class="{ active: isActive('/branch-layout') }"
        >
          영업점 창구 배치도
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore";
import { onMounted } from "vue";

const router = useRouter();
const userStore = useUserStore();

const handleNavigation = (path, requiredDeptCode) => {
  if (userStore.userDeptCode !== requiredDeptCode) {
    alert("권한이 없습니다.");
  } else {
    router.push(path);
  }
};

const isActive = (route) => {
  return router.currentRoute.value.path === route;
};

onMounted(() => {
  const userName = localStorage.getItem("userName") || "";
  const userNumber = localStorage.getItem("userNumber") || "";
  const userDeptId = localStorage.getItem("userDeptId") || "";
  const userDeptCode = localStorage.getItem("userDeptCode") || "";
  userStore.setUserName(userName);
  userStore.setUserNumber(userNumber);
  userStore.setUserDeptId(userDeptId);
  userStore.setUserDeptCode(userDeptCode);
  console.log("현재 유저 dept code: ", userStore.userDeptCode);
});
</script>

<style scoped>
.sidebar {
  width: 15dvw;
  background-color: #1a1a2e;
  color: #ffffff;
  padding: 20px;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
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
  background-color: #333;
  margin-right: 10px;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.name {
  font-size: 18px;
  font-weight: bold;
  color: #e0e0e0;
}

.number {
  font-size: 14px;
  color: #b0b0b0;
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
  color: #b0b0b0;
}

.menu li:hover {
  background-color: #2a2a3d;
}

.menu li.active {
  background-color: #3a3a5e;
  font-weight: bold;
  color: #ffffff;
}
</style>
