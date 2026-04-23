import { ref } from "vue";
import { useI18n } from "vue-i18n";
import axios, { AxiosError } from "axios";
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
  const { t, te } = useI18n();

  function alert(message: string, level: MessageLevel = "debug") {
    if (message && level !== "success") {
      // Add message.
      alerts.value.push({
        key: randomString(),
        message,
        level,
      });
      // Log to console for debugging
      console.warn(message);
    }
  }

  function dismiss(key: string) {
    alerts.value = alerts.value.filter((item) => item.key != key);
  }

  function clear() {
    alerts.value = [];
  }

  /** Display a backend error message. */
  const alertError = (err: unknown): undefined => {
    if (isAxiosMinkError(err)) {
      const data = err.response.data;

      // Use the return code to find a message, if available.
      if (data.return_code) {
        const translationKey = `api.code.${data.return_code}`;
        if (te(translationKey)) {
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

/** Check if the given error is an Axios error with a Mink response. */
function isAxiosMinkError(
  err: unknown,
): err is RequiredKeys<AxiosError<MinkResponse>, "response"> {
  return axios.isAxiosError(err) && err.response?.data;
}

/** Make the given keys required in the given type. */
type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;
