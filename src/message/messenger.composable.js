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

  /** Display a backend error message. */
  const alertError = (err) => {
    const message = err.response?.data?.message;
    // Proper Mink backend responses contain a message.
    if (message) {
      alert(message, "error");
    }
    // For other errors, like timeout or bad gateway, display it and hope the user understands it.
    else alert(err);
  };

  return {
    alert,
    dismiss,
    clear,
    alertError,
    alerts,
  };
}
