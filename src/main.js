import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "@/App.vue";
import router from "@/router/index.js";
import "@/assets/styles.css";
import { createToaster } from "@meforma/vue-toaster";

const app = createApp(App);
const pinia = createPinia();
app.config.globalProperties.$toast = createToaster({
  /* 옵션 설정 가능 */
});

app.use(pinia);
app.use(router);

app.mount("#app");
