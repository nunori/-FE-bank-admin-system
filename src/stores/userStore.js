// src/stores/userStore.js
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    userName: "",
    userNumber: "",
    userDeptId: "",
    userDeptCode: "", // 새로 추가
    userDvcd: "", // 새로 추가
  }),

  actions: {
    setUserName(name) {
      this.userName = name;
    },
    setUserNumber(number) {
      this.userNumber = number;
    },
    setUserDeptId(deptId) {
      this.userDeptId = deptId;
    },
    setUserDeptCode(deptCode) {
      // 새로 추가
      this.userDeptCode = deptCode;
    },
    setUserDvcd(dvcd) {
      // 새로 추가
      this.userDvcd = dvcd;
    },
    clearUser() {
      this.userName = "";
      this.userNumber = "";
      this.userDeptId = "";
      this.userDeptCode = "";
      this.userDvcd = "";
    },
  },

  getters: {
    isLoggedIn: (state) => !!state.userNumber,
    getUserName: (state) => state.userName,
    getUserNumber: (state) => state.userNumber,
    getUserDeptId: (state) => state.userDeptId,
    getUserDeptCode: (state) => state.userDeptCode, // 새로 추가
    getUserDvcd: (state) => state.userDvcd, // 새로 추가
  },
});
