import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { AxiosError } from "axios";
import { randomString } from "@/util";
import type { MinkResponse } from "@/api/api.types";

export type Alert = {
  key: string;
  message: string;
  level: MessageLevel;
};

export type MessageLevel = "error" | "success" | "debug";

const alerts = ref<Alert[]>([]);

export default function useMessenger() {
  const { t, locale, messages } = useI18n();

  function alert(message: string, level: MessageLevel = "debug") {
    if (message && level !== "success") {
      // Add message.
      alerts.value.push({
        key: randomString(),
        message,
        level,
      });
    }
  }

  function dismiss(key: string) {
    alerts.value = alerts.value.filter((item) => item.key != key);
  }

  function clear() {
    alerts.value = [];
  }

  /** Check if there is a translation for the given key.
   *
   * This replaces `te` until https://github.com/kazupon/vue-i18n/issues/1521 is fixed.
   */
  function translationExists(key: string) {
    return !!messages.value[locale.value][key];
  }

  /** Display a backend error message. */
  const alertError = (err: AxiosError<MinkResponse>): undefined => {
    if (err.response?.data) {
      const data = err.response.data;

      // Use the return code to find a message, if available.
      if (data.return_code) {
        const translationKey = `api.code.${data.return_code}`;
        if (translationExists(translationKey)) {
          // Pass the response data, plus request params, as variables to be replaced for "{placeholders}" in the translation message.
          const messageVariables = { ...err.config?.params, ...data };
          alert(t(translationKey, messageVariables), "error");
          return;
        }
        console.warn(
          `Translation missing for return code "${data.return_code}"`,
        );
      }

      // If return code missing, or translation not available, fall back to message in data.
      if (data.message) {
        alert(data.message, "error");
        return;
      }
    }
    // For other errors, like timeout or bad gateway, display it and hope the user understands it.
    alert(String(err));
  };

  return {
    alert,
    dismiss,
    clear,
    alertError,
    alerts,
  };
}
