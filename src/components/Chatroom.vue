<template>
  <div class="chat-container">
    <div class="header p-3 d-flex align-items-center justify-content-between">
      <router-link
        to="/"
        class="text-white text-decoration-none"
        @click="leaveRoom"
      >
        <i class="bi bi-arrow-left fs-4 fw-bold"></i
      ></router-link>
      <h2 class="text-center title">{{ String(roomId).toUpperCase() }}</h2>
      <div class="d-flex">
        <i class="bi bi-person-circle me-1"></i>
        {{ roomSize }}
      </div>
    </div>
    <div class="messages p-3">
      <div v-for="(message, index) in messages" :key="index">
        <div v-if="message.type === 'others'" class="ms-2 mb-1 fw-bold">
          {{ message.user }}
        </div>
        <div
          v-if="message.type === 'own' || message.type === 'others'"
          :class="[
            'd-flex mb-4',
            message.type === 'own' ? 'justify-content-end' : '',
          ]"
        >
          <div
            class="d-flex align-items-end"
            style="max-width: 75%"
            :class="{ 'flex-row-reverse': message.type === 'own' }"
          >
            <div class="d-flex flex-column">
              <div
                class="message-content p-3"
                :class="
                  message.type === 'own'
                    ? 'text-white sender'
                    : 'bg-light border'
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
        <div
          v-else
          class="text-center text-secondary mb-3"
          style="font-size: 14px"
        >
          {{ message.text }}
        </div>
      </div>
    </div>
    <div class="footer p-3 d-flex align-items-center">
      <!-- <i class="bi bi-mic-fill me-3"></i>
      <i class="bi bi-camera-fill me-3"></i>
      <i class="bi bi-image-fill me-3"></i> -->
      <input
        type="text"
        v-model="message"
        class="form-control me-3"
        placeholder="請輸入訊息..."
        @keydown.enter="sendMessage"
      />
      <i class="bi bi-send" role="button" @click="sendMessage"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, nextTick, onMounted } from "vue";
import { io } from "socket.io-client";
import { useRoute, useRouter } from "vue-router";
import { errorAlert } from "@/methods/sweetAlert";

const socket = io(import.meta.env.VITE_SOCKET_DOMAIN);
// const socket = io("https://express-hello-world-wllx.onrender.com/");
const message: Ref<string> = ref("");
const route = useRoute();
const router = useRouter();
const { userName, roomId } = route.params;
const roomSize: Ref<number> = ref(0);
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
    userName,
    roomId,
    message: message.value,
  });
  message.value = "";
  scrollToBottom();
};

const leaveRoom = (isReload: boolean = false) => {
  sessionStorage.removeItem("isReload");
  socket.emit("leaveRoom", {
    name: userName,
    roomId,
    isReload,
  });
};
socket.on("roomSize", (size: number) => {
  roomSize.value = size;
});

socket.on("systemMsg", (msg: string) => {
  messages.value.push({
    user: null,
    text: msg,
    time: getCurrentTime(),
    type: "system",
  });
});

socket.on("returnMessage", (msgInfo: { userName: string; message: string }) => {
  messages.value.push({
    user: msgInfo.userName,
    text: msgInfo.message,
    time: getCurrentTime(),
    type: msgInfo.userName === userName ? "own" : "others",
  });
  scrollToBottom();
});
socket.on("logout", () => {
  errorAlert("Oops...", "你的使用者帳號似乎在其他地方被登入了請重新嘗試。");
  sessionStorage.removeItem("isReload");
  router.push("/");
});

interface Message {
  user: string | unknown;
  text: string;
  time: string;
  type: string;
}
const messages: Ref<Message[]> = ref([]);

onMounted(() => {
  const isReload: string | unknown = sessionStorage.getItem("isReload");
  if (isReload === "true") {
    leaveRoom(true);
    sessionStorage.removeItem("isReload");
    router.push("/");
  } else {
    sessionStorage.setItem("isReload", "true");
    socket.emit("joinRoom", {
      name: userName,
      roomId,
    });
  }
});
window.addEventListener("beforeunload", () => {
  leaveRoom();
});
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
