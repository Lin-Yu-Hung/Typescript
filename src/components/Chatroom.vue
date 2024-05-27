<template>
  <div class="chat-container">
    <div class="header p-3 d-flex align-items-center">
      <router-link to="/" class="text-white text-decoration-none">
        <span class="me-3 fs-5">&#x1F860;</span></router-link
      >
      <h2 class="text-center title">{{ roomId }}</h2>
    </div>
    <div class="messages p-3">
      <div v-for="(message, index) in messages" :key="index" class="message">
        <div
          v-if="message.type === 'own' || message.type === 'others'"
          :class="[
            'd-flex',
            message.type === 'own' ? 'justify-content-end' : '',
          ]"
        >
          <div
            class="d-flex mb-4 align-items-end"
            style="max-width: 75%"
            :class="{ 'flex-row-reverse': message.type === 'own' }"
          >
            <div class="d-flex flex-column">
              <span v-if="message.type !== 'own'" class="ms-2 mb-1 fw-bold">{{
                message.user
              }}</span>
              <div
                class="message-content message-others p-3"
                :class="
                  message.type === 'own'
                    ? 'text-white sender'
                    : 'bg-light receiver border'
                "
              >
                {{ message.text }}
              </div>
            </div>

            <small
              class="fs-small text-secondary"
              style="font-size: 12px"
              :class="[message.type === 'own' ? 'me-3' : 'ms-3']"
            >
              {{ message.time }}
            </small>
          </div>
        </div>
        <div v-else class="text-center text-secondary" style="font-size: 14px">
          {{ message.text }}
        </div>
      </div>
    </div>
    <div class="footer p-3 d-flex align-items-center">
      <i class="bi bi-mic-fill me-3"></i>
      <i class="bi bi-camera-fill me-3"></i>
      <i class="bi bi-image-fill me-3"></i>
      <input
        type="text"
        v-model="message"
        class="form-control me-3"
        placeholder="write message.."
        @keydown.enter="sendMessage"
      />
      <span class="me-3 fs-4" role="button" @click="sendMessage"
        >&#x2B9A;
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, nextTick } from "vue";
import { io } from "socket.io-client";
import { useRoute } from "vue-router";

const socket = io(import.meta.env.VITE_SOCKET_DOMAIN);
const message: Ref<string> = ref("test");
const route = useRoute();
const { userName, roomId } = route.params;

const getCurrentTime = (): string => {
  const now: Date = new Date();
  let hours: number = now.getHours();
  const minutes: string = now.getMinutes().toString().padStart(2, "0"); // 取得分鐘，並補0至兩位數

  // 檢查是上午還是下午，並調整小時值
  const amOrPm: string = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // 將小時值轉換為12小時制
  const formattedHours: string = hours.toString().padStart(2, "0"); // 補0至兩位數
  const currentTime: string = `${formattedHours}:${minutes} ${amOrPm}`; // 格式化時間為HH:mm AM/PM
  return currentTime;
};
const scrollToBottom = () => {
  nextTick(() => {
    setTimeout(() => {
      const messagesContainer = document.querySelector(".messages");
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 1);
  });
};
const sendMessage = () => {
  if (!message.value) return;
  socket.emit("sendMessage", {
    roomId,
    message: message.value,
  });
  message.value = "";
  scrollToBottom();
};
socket.emit("joinRoom", {
  name: userName,
  roomId,
});
socket.on("joinFinish", (msg: string) => {
  messages.value.push({
    user: userName,
    text: msg,
    time: getCurrentTime(),
    type: "system",
  });
});

socket.on("returnMessage", (msg: string) => {
  // console.log("🚀  msg:", msg);

  // 使用範例
  messages.value.push({
    user: userName,
    text: msg,
    time: getCurrentTime(),
    type: "own",
  });
});
const messages: Ref<any[string]> = ref([
  {
    user: "John Lewis",
    text: "Hi !! This is message from John Lewis",
    time: "11:01 PM",
    type: "others",
  },
]);
</script>

<style lang="scss" scoped>
.title {
  width: calc(100% - 36px * 2);
  margin-bottom: 0px;
}
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100svh;
  max-width: 600px;
  margin: 0 auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.header,
.footer {
  flex: 0 0 auto;
  background-color: #1b232e;
  color: white;
}

.messages {
  flex: 1 1 auto;
  overflow-y: auto;
  background-color: #f1f0f0;
}

.message-content {
  border-radius: 20px;
  padding: 10px;
  word-wrap: break-word;
  position: relative;
}

.sender {
  background-color: #1b232e;
}

.receiver {
  background-color: #f1f0f0;
}

input.form-control {
  background-color: #f1f0f0;
  border: none;
  border-radius: 20px;
}

input.form-control::placeholder {
  color: #999;
}

.bg-light {
  background-color: #f1f0f0 !important;
}

.bg-primary {
  background-color: #1b232e !important;
}
</style>
