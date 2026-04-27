import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { randomString } from "@/util";
import type { BackendError } from "@/api/api.types";
import { isBackendError } from "@/api/api";

export type Alert = {
  key: string;
  message: string;
};

const alerts = ref<Alert[]>([]);

export default function useAlert() {
  const { t, te } = useI18n();

  function push(message: string) {
    alerts.value.push({
      key: randomString(),
      message,
    });
  }

  function dismiss(key: string) {
    alerts.value = alerts.value.filter((item) => item.key != key);
  }

  function clear() {
    alerts.value = [];
  }

  function showAlert(error: unknown): undefined {
    if (isBackendError(error)) {
      const message = getBackendErrorMessage(error);
      push(message);
    } else {
      const message = error instanceof Error ? error.message : String(error);
      push(message);
      // Log to console for debugging
      console.warn(error);
    }
  }

  function getBackendErrorMessage(err: BackendError): string {
    const data = err.response.data;

    // Use the return code to find a message, if available.
    if (data.return_code) {
      const translationKey = `api.code.${data.return_code}`;
      if (te(translationKey)) {
        // Pass the response data, plus request params, as variables to be replaced for "{placeholders}" in the translation message.
        const messageVariables = { ...err.config?.params, ...data };
        return t(translationKey, messageVariables);
      }
      console.warn(`Translation missing for return code "${data.return_code}"`);
    }

    // If return code missing, or translation not available, fall back to message in data.
    return data.message;
  }

  return {
    showAlert,
    dismiss,
    clear,
    alerts,
  };
}
