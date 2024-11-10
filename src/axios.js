import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 404) {
      // 404 에러 시 홈으로 리다이렉트
      router.push("/home");
      return Promise.reject(new Error("페이지를 찾을 수 없습니다."));
    }
    if (error.response && error.response.status === 401) {
      // 인증 에러 시 로그인 페이지로
      router.push("/");
      return Promise.reject(new Error("인증이 필요합니다."));
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;
