import { SbAuthService } from "./sbauth";
import { useAppConfig } from "@/app/useAppConfig";

/** Global instance of the service */
let service: SbAuthService | undefined;

/** Provide the auth service */
export function useAuth() {
  const { appConfig } = useAppConfig();

  if (!service) {
    const { apiUrl, logoutUrl, guiUrl } = appConfig.auth;
    service = new SbAuthService(apiUrl, logoutUrl, guiUrl);
  }

  return service;
}
