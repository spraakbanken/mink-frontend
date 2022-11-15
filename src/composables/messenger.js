import { ref } from "vue";

const alerts = ref([]); // {message, status}[]

export default function useMessenger() {
  function alert(message, status) {
    if (message && status !== "success") {
      // Add message.
      alerts.value.push({ message, status: status || "debug" });
      // Remove it after a while.
      setTimeout(() => alerts.value.shift(), 5000);
    }
  }

  return {
    alert,
    alerts,
  };
}
