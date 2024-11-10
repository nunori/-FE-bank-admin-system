import axios from "axios";
import router from "/.router";

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest", // CORS 요청임을 명시
  },
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    // CORS preflight 요청을 위한 헤더 추가
    if (config.method === "options") {
      config.headers["Access-Control-Request-Method"] =
        "POST, GET, DELETE, PUT, PATCH";
      config.headers["Access-Control-Request-Headers"] =
        "Authorization, Content-Type";
    }
    return config;
  },
  (error) => {
    console.error("Request Interceptor Error:", error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.error("Response Error:", error);

    // 네트워크 오류
    if (!error.response) {
      console.error("Network Error:", error);
      return Promise.reject(new Error("서버와의 연결에 실패했습니다."));
    }

    // CORS 오류
    if (error.code === "ERR_NETWORK") {
      console.error("CORS Error:", error);
      return Promise.reject(new Error("CORS 오류가 발생했습니다."));
    }

    switch (error.response.status) {
      case 401:
        console.log("Unauthorized - Redirecting to login");
        await router.push("/");
        return Promise.reject(new Error("인증이 필요합니다."));

      case 403:
        console.log("Forbidden - Redirecting to home");
        await router.push("/home");
        return Promise.reject(new Error("접근 권한이 없습니다."));

      case 404:
        console.log("Not Found - Redirecting to home");
        await router.push("/home");
        return Promise.reject(new Error("페이지를 찾을 수 없습니다."));

      default:
        return Promise.reject(error);
    }
  }
);

// axios 전역 설정
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

export default axiosInstance;
