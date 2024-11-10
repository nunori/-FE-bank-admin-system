<script setup>
import { ref } from "vue";
import axiosInstance from "@/axios.js";
import { useRouter } from "vue-router";

const user = ref({
  number: "",
  password: "",
  name: "",
  deptId: "", // department -> deptId로 이름 변경
  deptCode: "", // 새로 추가
  dvcd: "",
});

const errors = ref({
  number: "",
  password: "",
  deptCode: "", // 새로 추가
});

const router = useRouter();

const validateNumber = () => {
  if (user.value.number.length !== 7) {
    errors.value.number = "사번은 7자리입니다.";
    return false;
  }
  errors.value.number = "";
  return true;
};

const validatePassword = () => {
  if (user.value.password.length < 8) {
    errors.value.password = "비밀번호는 8자리 이상이어야 합니다.";
    return false;
  }
  errors.value.password = "";
  return true;
};

const validateDeptCode = () => {
  if (!["01", "02"].includes(user.value.deptCode)) {
    errors.value.deptCode =
      "부서 코드는 01(본부) 또는 02(영업점)이어야 합니다.";
    return false;
  }
  errors.value.deptCode = "";
  return true;
};

const submitForm = async () => {
  // 모든 검증 실행
  const isNumberValid = validateNumber();
  const isPasswordValid = validatePassword();
  const isDeptCodeValid = validateDeptCode();

  if (!isNumberValid || !isPasswordValid || !isDeptCodeValid) {
    return;
  }

  try {
    console.log("회원가입 정보: ", user.value);

    const response = await axiosInstance.post("/users/register", {
      userNumber: user.value.number,
      userPassword: user.value.password,
      userName: user.value.name,
      deptId: parseInt(user.value.deptId), // String을 Integer로 변환
      deptCode: user.value.deptCode, // 새로 추가
      userDvcd: user.value.dvcd,
    });

    console.log("서버 응답: ", response.data);
    alert("회원가입 성공");
    router.push("/home");
  } catch (e) {
    if (e.response?.data?.message === "이 사번은 이미 사용중입니다.") {
      alert("이미 사용 중인 사번입니다.");
    } else {
      console.error("회원가입 오류: ", e);
      alert("회원가입에 실패했습니다. 다시 시도해주세요.");
    }
  }
};
</script>

<template>
  <div class="register">
    <h2>회원가입</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="user-number">사번</label>
        <input
          type="text"
          id="number"
          v-model="user.number"
          required
          placeholder="사번을 입력하세요 (7자리)"
          @input="validateNumber"
        />
        <p v-if="errors.number" class="error" style="color: red">
          {{ errors.number }}
        </p>
      </div>

      <div class="form-group">
        <label for="password">비밀번호</label>
        <input
          type="password"
          id="password"
          v-model="user.password"
          required
          placeholder="비밀번호를 입력하세요 (8자리 이상)"
          @input="validatePassword"
        />
        <p v-if="errors.password" class="error" style="color: red">
          {{ errors.password }}
        </p>
      </div>

      <div class="form-group">
        <label for="name">이름</label>
        <input
          type="text"
          id="name"
          v-model="user.name"
          required
          placeholder="이름을 입력하세요"
        />
      </div>

      <div class="form-group">
        <label for="deptId">지점 ID</label>
        <input
          type="number"
          id="deptId"
          v-model="user.deptId"
          required
          placeholder="지점 ID를 입력하세요"
        />
      </div>

      <div class="form-group">
        <label for="deptCode">지점 코드</label>
        <select
          id="deptCode"
          v-model="user.deptCode"
          required
          @change="validateDeptCode"
        >
          <option value="">선택하세요</option>
          <option value="01">본부</option>
          <option value="02">영업점</option>
        </select>
        <p v-if="errors.deptCode" class="error" style="color: red">
          {{ errors.deptCode }}
        </p>
      </div>

      <div class="form-group">
        <label for="division-code">업무 구분 코드</label>
        <input
          type="text"
          id="division-code"
          v-model="user.dvcd"
          required
          placeholder="업무 구분 코드를 입력하세요"
        />
      </div>

      <button type="submit">회원가입</button>
    </form>
  </div>
</template>

<style scoped>
.register {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input,
select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 5px;
}

button {
  background-color: #4caf50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
}

button:hover {
  background-color: #45a049;
}

.error {
  font-size: 0.8em;
  margin-top: 5px;
}
</style>
