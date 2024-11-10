<template>
  <div class="sidebar" :class="{ collapsed: isCollapsed }">
    <div class="toggle-button" @click="toggleSidebar">
      <span class="toggle-icon">{{ isCollapsed ? ">>" : "<<" }}</span>
    </div>

    <div class="sidebar-content" :class="{ hidden: isCollapsed }">
      <div class="user-info">
        <div class="avatar">
          <img src="@/assets/img/profile_img.jpg" alt="profile_img" />
        </div>
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
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore";

const router = useRouter();
const userStore = useUserStore();
const isCollapsed = ref(false);

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};

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
  position: relative;
  transition: all 0.3s ease;
}

.collapsed {
  width: 0.3rem;
  padding: 20px 10px;
}

.toggle-button {
  position: absolute;
  right: -25px;
  top: 20px;
  background-color: #1a1a2e;
  color: white;
  width: 25px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 0 5px 5px 0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.3);
  z-index: 100;
}

.toggle-icon {
  font-size: 12px;
  font-weight: bold;
}

.toggle-button:hover {
  background-color: #2a2a3e;
}

.sidebar-content {
  opacity: 1;
  transition: opacity 0.2s ease;
  width: 100%;
}

.hidden {
  opacity: 0;
  visibility: hidden;
  transition: visibility 0s 0.2s, opacity 0.2s ease;
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
  flex-shrink: 0;
  overflow: hidden; /* 이미지가 영역을 벗어나지 않도록 설정 */
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 이미지 비율을 유지하면서 영역을 채움 */
}

.user-details {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.name {
  font-size: 18px;
  font-weight: bold;
  color: #e0e0e0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.number {
  font-size: 14px;
  color: #b0b0b0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
