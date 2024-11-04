<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const user = ref({
  number: "",
  password: "",
  name: "",
  department: "",
  dvcd: "",
});

const errors = ref({
  number: "",
  password: "",
});

const router = useRouter();

const validateNumber = () => {
  if (user.value.number.length !== 7) {
    errors.value.number = "사번은 7자리입니다.";
  } else {
    errors.value.number = "";
  }
};

const validatePassword = () => {
  if (user.value.password.length < 8) {
    errors.value.password = "비밀번호는 8자리 이상이어야 합니다.";
  } else {
    errors.value.password = "";
  }
};

const submitForm = async () => {
  validateNumber();
  validatePassword();

  if (errors.value.number || errors.value.password) {
    return;
  }

  try {
    console.log("회원가입 정보: ", user.value);

    const response = await axios.post(
      "http://localhost:8080/api/users/register",
      {
        userNumber: user.value.number,
        userPassword: user.value.password,
        userName: user.value.name,
        deptId: user.value.department,
        userDvcd: user.value.dvcd,
      }
    );

    console.log("서버 응답: ", response.data);
    alert("회원가입 성공");
    router.push("/");
  } catch (e) {
    if (
      e.response &&
      e.response.data &&
      e.response.data.message === "이 사번은 이미 사용중입니다."
    ) {
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
          placeholder="사번을 입력하세요"
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
          placeholder="비밀번호를 입력하세요"
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
        <label for="deparment">소속 부서</label>
        <input
          type="text"
          id="department"
          v-model="user.department"
          required
          placeholder="부서를 입력하세요"
        />
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

<script scoped></script>
