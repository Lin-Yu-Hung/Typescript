<template>
  <div class="chat-container">
    <div class="header p-3 d-flex align-items-center">
      <img
        src="https://via.placeholder.com/50"
        alt="User"
        class="rounded-circle me-2"
      />
      <div>
        <h5 class="mb-0">John Lewis</h5>
        <small>3 hours ago...</small>
      </div>
      <div class="ms-auto">
        <i class="bi bi-telephone me-3"></i>
        <i class="bi bi-camera-video me-3"></i>
        <i class="bi bi-info-circle"></i>
      </div>
    </div>
    <div class="messages p-3">
      <div v-for="(message, index) in messages" :key="index" class="message">
        <div
          :class="[
            'd-flex',
            message.user === 'me' ? 'justify-content-end' : '',
          ]"
        >
          <div
            class="message-content p-3 mb-2"
            :class="
              message.user === 'me' ? 'text-white sender' : 'bg-light receiver'
            "
          >
            <img
              v-if="message.user !== 'me'"
              src="https://via.placeholder.com/30"
              alt="User"
              class="rounded-circle me-2"
            />
            {{ message.text }}
          </div>
        </div>
        <small
          :class="[
            'd-block text-muted',
            message.user === 'me' ? 'text-end' : '',
          ]"
        >
          {{ message.time }} | {{ message.date }}
        </small>
      </div>
    </div>
    <div class="footer p-3 d-flex align-items-center">
      <i class="bi bi-mic-fill me-3"></i>
      <i class="bi bi-camera-fill me-3"></i>
      <i class="bi bi-image-fill me-3"></i>
      <input
        type="text"
        class="form-control me-3"
        placeholder="write message.."
      />
      <i class="bi bi-send-fill"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const messages = ref([
  {
    user: "John Lewis",
    text: "Hi !! This is message from John Lewis",
    time: "11:01 PM",
    date: "October 11",
  },
  {
    user: "me",
    text: "Hello !! This is message from me",
    time: "10:05 PM",
    date: "November 15",
  },
  {
    user: "John Lewis",
    text: "Hi !! This is 2nd message from John Lewis",
    time: "11:59 PM",
    date: "Yesterday",
  },
  {
    user: "me",
    text: "Hello !! This is 2nd message from me",
    time: "09:15 AM",
    date: "Today",
  },
  {
    user: "John Lewis",
    text: "Subscribe Easy Tutorials Channel to watch more videos and Press bell icon.",
    time: "11:01 AM",
    date: "Today",
  },
]);
</script>

<style lang="scss" scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
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

.message {
  margin-bottom: 15px;
}

.message-content {
  max-width: 75%;
  border-radius: 20px;
  padding: 10px;
  word-wrap: break-word;
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
