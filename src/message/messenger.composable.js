import { ref } from "vue";
import remove from "lodash/remove";
import { randomString } from "@/util";
import { useI18n } from "vue-i18n";

const alerts = ref([]); // {key, message, status}[]

export default function useMessenger() {
  const { t, locale, messages } = useI18n();

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

  /** Check if there is a translation for the given key.
   *
   * This replaces `te` until https://github.com/kazupon/vue-i18n/issues/1521 is fixed.
   */
  function translationExists(key) {
    return !!messages.value[locale.value][key];
  }

  /** Display a backend error message. */
  const alertError = (err) => {
    if (err.response?.data) {
      const data = err.response.data;

      // Use the return code to find a message, if available.
      if (data.return_code) {
        const translationKey = `api.code.${data.return_code}`;
        if (translationExists(translationKey)) {
          // Pass the response data as variables to be replaced for "{placeholders}" in the translation message.
          alert(t(translationKey, data), "error");
          return;
        }
        console.warn(
          `Translation missing for return code "${data.return_code}"`
        );
      }

      // If return code missing, or translation not available, fall back to message in data.
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
