import { ref } from "vue";

export default function useMessenger() {
  const messages = ref([]);

  function handleResponse({ message, status }) {
    if (message && status !== "success") {
      // Add message.
      messages.value.push({ message, status: status || "debug" });
      // Remove it after a while.
      setTimeout(() => messages.value.shift(), 3000);
    }
  }

  return {
    handleResponse,
    messages,
  };
}
