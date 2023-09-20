import { ref } from "vue";
import remove from "lodash/remove";
import { randomString } from "@/util";
import { useI18n } from "vue-i18n";

const alerts = ref([]); // {key, message, status}[]

export default function useMessenger() {
  const { t } = useI18n();

  function alert(message, status) {
    if (message && status !== "success") {
      // Add message.
      alerts.value.push({
        key: randomString(),
        message,
        status: status || "debug",
      });
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
    if (err.response?.data) {
      const data = err.response.data;

      // Use the return code to find a message, if available.
      if (data.return_code) {
        // Pass the response data as variables to be replaced for "{placeholders}" in the translation message.
        const translationKey = `api.code.${data.return_code}`;
        const translatedMessage = t(translationKey, data);
        // If there is no translation to this code, `t` will just return the key, so guard against that.
        // TODO The `te` function should do this nicer, but it just seems to return `false`.
        if (translatedMessage != translationKey) {
          alert(translatedMessage, "error");
          return;
        }
      }

      // If return code missing, or translation not available, fall back to message in data.
      console.warn(`Translation missing for return code "${data.return_code}"`);
      if (data.message) {
        alert(data.message, "error");
        return;
      }
    }
    // For other errors, like timeout or bad gateway, display it and hope the user understands it.
    alert(err);
  };

  return {
    alert,
    dismiss,
    clear,
    alertError,
    alerts,
  };
}
