import { ref } from "vue";

const alerts = ref([]); // {message, status}[]

export default function useMessenger() {
  function handleResponse(response) {
    if (!response.message) return;
    const { message, status } = response;
    if (message && status !== "success") {
      // Add message.
      console.log("add", message, status);
      alerts.value.push({ message, status: status || "debug" });
      // Remove it after a while.
      setTimeout(() => alerts.value.shift(), 5000);
    }
  }

  return {
    handleResponse,
    alerts,
  };
}
