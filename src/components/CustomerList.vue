<script setup></script>

<template>
  <div class="customer-list">
    <table>
      <thead>
        <tr>
          <th>확인</th>
          <th>순번</th>
          <th>업무 종류</th>
          <th>호출</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="customer in customers" :key="customer.id">
          <td><input type="checkbox" /></td>
          <td>{{ customer.order }}</td>
          <td>{{ customer.task }}</td>
          <td><button @click="callCustomer(customer)">호출하기</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
