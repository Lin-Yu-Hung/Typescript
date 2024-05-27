<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="mb-3 mb-xl-5 text-center">登入</h2>
      <div class="mb-3">
        <label for="username" class="form-label">使用者名稱</label>
        <input
          type="text"
          class="form-control"
          id="username"
          placeholder="輸入使用者名稱"
          v-model="userName"
        />
      </div>
      <div class="mb-4">
        <label for="room" class="form-label">選擇聊天室</label>
        <select class="form-select" id="room" v-model="chatroom">
          <option value="room1">ROOM1</option>
          <option value="room2">ROOM2</option>
          <option value="room3">ROOM3</option>
          <option value="room4">ROOM4</option>
          <option value="room5">ROOM5</option>
        </select>
      </div>

      <button
        @click="login"
        type="button"
        class="btn btn-primary w-100 text-white text-decoration-none"
      >
        進入聊天室
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { io } from "socket.io-client";
import { ref, Ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
// const socket = io("http://localhost:3000");
// 監聽與後端的連線事件

const userName: Ref<string> = ref("使用者1");
const chatroom: Ref<string> = ref("room1");

const login = (): void => {
  if (!userName.value) return;
  // socket.emit("joinRoom", {
  //   name: userName.value,
  //   roomId: chatroom.value,
  // });
  router.push(`/Chatroom/${userName.value}/${chatroom.value}`);
};

// socket.on("returnMessage", (msg: string) => {
//   console.log("🚀  msg:", msg);
// });
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-card {
  display: flex;
  justify-content: center;
  flex-direction: column;
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  max-width: 450px;
  width: 100%;
  height: 400px;
}

h2 {
  color: #1b232e;
}

.form-label {
  color: #1b232e;
}

.form-control,
.form-select {
  border-radius: 20px;
}

.btn-primary {
  background-color: #1b232e;
  border: none;
}

.btn-primary:hover {
  background-color: #13191f;
}

@media (max-width: 576px) {
  .login-card {
    padding: 1.5rem;
  }
}
</style>
