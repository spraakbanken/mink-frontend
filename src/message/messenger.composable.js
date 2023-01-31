import { ref } from "vue";
import remove from "lodash/remove";

const alerts = ref([]); // {key, message, status}[]

export default function useMessenger() {
  function alert(message, status) {
    if (message && status !== "success") {
      const key = Math.random().toString(36);
      // Add message.
      alerts.value.push({ key, message, status: status || "debug" });
    }
  }

  function dismiss(key) {
    remove(alerts.value, (item) => item.key == key);
  }

  function clear() {
    alerts.value = [];
  }

  return {
    alert,
    dismiss,
    clear,
    alerts,
  };
}
