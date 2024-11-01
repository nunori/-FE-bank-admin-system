<script setup>
import { ref } from "vue";

const user = ref({
  name: "",
  department: "",
  password: "",
});

const submitForm = () => {
  console.log("회원가입 정보: ", user.value);
};
</script>

<template>
  <div class="register">
    <h2>회원가입</h2>
    <form @submit.prevent="submitForm">
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
        <label for="password">비밀번호</label>
        <input
          type="password"
          id="password"
          v-model="user.password"
          required
          placeholder="비밀번호를 입력하세요"
        />
      </div>
      <button type="submit">회원가입</button>
    </form>
  </div>
</template>

<script scoped></script>
