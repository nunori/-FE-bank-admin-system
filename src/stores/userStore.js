import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    userName: "",
    userNumber: "",
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
  },
});
