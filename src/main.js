import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router/index.js"; // 라우트 설정 파일

const app = createApp(App);
app.use(router);
app.mount("#app");
