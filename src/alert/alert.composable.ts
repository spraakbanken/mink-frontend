import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { useMatomo } from "vue3-matomo";
import { randomString } from "@/util";
import type { BackendError } from "@/api/api.types";
import { isBackendError } from "@/api/api";

export type Alert = {
  key: string;
  message: string;
  severity: AlertSeverity;
  time: Date;
};

type AlertSeverity = "error" | "success";

const alerts = ref<Alert[]>([]);

export default function useAlert() {
  const { t, te } = useI18n();
  const matomo = useMatomo();
  const route = useRoute();

  function pushAlert(message: string, severity: AlertSeverity = "error") {
    // Add message to list
    alerts.value.push({
      key: randomString(),
      message,
      severity,
      time: new Date(),
    });

    // Log as tracked event in Matomo
    try {
      // Get the path template (without param values) for anonymization
      // `route.matched` has parent/child routes, the last is the most specific
      const path = route.matched[route.matched.length - 1]?.path;
      matomo.value?.trackEvent("Alert", path || "(no path)", message);
    } catch (err) {
      console.warn("Failed to track alert event in Matomo", err);
    }
  }

  function dismiss(key: string) {
    alerts.value = alerts.value.filter((item) => item.key != key);
  }

  function clear() {
    // Keep alerts from the last second, to avoid abrupt disappearance of just-added alerts
    alerts.value = alerts.value.filter(
      (item) => item.time > new Date(Date.now() - 1000),
    );
  }

  function showAlert(error: unknown): undefined {
    if (isBackendError(error)) {
      const message = getBackendErrorMessage(error);
      pushAlert(message);
    } else {
      const message = error instanceof Error ? error.message : String(error);
      pushAlert(message);
      // Log to console with trace for debugging
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
    pushAlert,
    showAlert,
    dismiss,
    clear,
    alerts,
  };
}
