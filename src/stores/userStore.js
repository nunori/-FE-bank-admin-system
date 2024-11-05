import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    userName: "",
    userNumber: "",
    userDeptId: "",
  }),
  actions: {
    setUserName(userName) {
      this.userName = userName;
    },
    clearUserName() {
      this.userName = "";
    },
    setUserNumber(userNumber) {
      this.userNumber = userNumber;
    },
    clearUserNumber() {
      this.userNumber = "";
    },
    setUserDeptId(userDeptId) {
      this.userDeptId = userDeptId;
    },
    clearUserDeptId() {
      this.userDeptId = "";
    },
  },
});
