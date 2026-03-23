import Axios, { type AxiosInstance } from "axios";
import { once } from "es-toolkit";
import { deduplicateRequest, ensureTrailingSlash } from "@/util";
import type {
  MinkResponse,
  InfoData,
  ResourceListData,
  CreateCorpusData,
  ResourceStatusListData,
  ListExportsData,
  AdminModeStatusData,
  CreateMetadataData,
  ProgressHandler,
  JobStateMap,
  SparvSchemaData,
  SparvExportsData,
  ResourceInfo,
} from "@/api/api.types";

/** Create a `text/yaml` file object with content */
const yamlAsFile = (filename: string, yaml: string): File =>
  new File([yaml], filename, { type: "text/yaml" });

/** Create a form data object with one or more files under a given name */
function filesFormData(name: string, ...files: File[]): FormData {
  const formData = new FormData();
  files.forEach((file) => formData.append(name, file));
  return formData;
}

/** Handle an exception from an API call that may be encoded as Blob */
async function rethrowBlobError(error: unknown): Promise<never> {
  if (Axios.isAxiosError(error) && error.response?.data instanceof Blob) {
    // Parse JSON and replace the blob
    const text = await error.response.data.text();
    error.response.data = JSON.parse(text) as MinkResponse;
  }
  throw error;
}

/** Mink backend API client */
class MinkApi {
  /** An instance of the Axios HTTP client. */
  axios: AxiosInstance;

  /** A JWT token used to authenticate API requests. */
  jwt: string | undefined;

  /** Creates the client instance */
  constructor() {
    this.axios = Axios.create({
      baseURL: ensureTrailingSlash(import.meta.env.VITE_BACKEND_URL),
      withCredentials: true,
    });
  }

  /** Sets a JWT token which is then used to authenticate API requests. */
  setJwt(jwt?: string) {
    this.jwt = jwt;
    this.axios.defaults.headers["Authorization"] = jwt ? `Bearer ${jwt}` : null;
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Documentation/operation/info */
  getInfo = once(async () => {
    const response = await this.axios.get<MinkResponse<InfoData>>("info");
    return response.data;
  });

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Documentation/operation/sparv-exports */
  sparvExports = once(async () => {
    const response = await this.axios.get<MinkResponse<SparvExportsData>>(
      "corpus/sparv/list-exports",
    );
    return response.data.exports;
  });

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Documentation/operation/sparv-schema */
  sparvSchema = once(async () => {
    const response = await this.axios.get<MinkResponse<SparvSchemaData>>(
      "corpus/sparv/get-schema",
    );
    return response.data.sparv_schema;
  });

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Resources/operation/list-resources */
  async listResources() {
    const response =
      await this.axios.get<MinkResponse<ResourceListData>>("resource/list");
    return response.data.resources;
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Corpora/operation/create-corpus */
  async createCorpus() {
    const response =
      await this.axios.post<MinkResponse<CreateCorpusData>>("corpus/create");
    return response.data.resource_id;
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Metadata/operation/create-metadata */
  async createMetadata(publicId: string) {
    const response = await this.axios.post<MinkResponse<CreateMetadataData>>(
      "metadata/create",
      undefined,
      { params: { public_id: publicId } },
    );
    return response.data.resource_id;
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Corpora/operation/remove-corpus */
  async removeCorpus(id: string) {
    const response = await this.axios.delete<MinkResponse>(
      "corpus/remove/" + id,
    );
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Metadata/operation/remove-metadata */
  async removeMetadata(id: string) {
    const response = await this.axios.delete<MinkResponse>(
      "metadata/remove/" + id,
    );
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Config/operation/upload-config */
  async uploadConfig(id: string, config: string) {
    const formData = filesFormData("file", yamlAsFile("config.yaml", config));
    const response = await this.axios.put<MinkResponse>(
      "corpus/config/upload/" + id,
      formData,
    );
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Sources/operation/download-sources */
  async downloadSources<B extends boolean>(
    id: string,
    filename: string,
    binary: B,
  ) {
    const response = await this.axios
      .get<B extends true ? Blob : string>("corpus/sources/download/" + id, {
        params: { file: filename, zip: false },
        responseType: binary ? "blob" : "text",
      })
      .catch(rethrowBlobError);
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Sources/operation/upload-sources */
  async uploadSources(id: string, files: File[], onProgress?: ProgressHandler) {
    const formData = filesFormData("files", ...files);
    const response = await this.axios.put<MinkResponse>(
      "corpus/sources/upload/" + id,
      formData,
      { onUploadProgress: onProgress },
    );
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Sources/operation/remove-sources */
  async removeSource(id: string, name: string) {
    const response = await this.axios.delete<MinkResponse>(
      "corpus/sources/remove/" + id,
      { params: { remove: name } },
    );
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Config/operation/download-config */
  downloadConfig = deduplicateRequest(async (id: string) => {
    const response = await this.axios
      .get<string>("corpus/config/download/" + id)
      .catch((error) => {
        // 404 means no config which is fine, rethrow other errors.
        if (error.response?.status == 404) return undefined;
        throw error;
      });
    return response?.data;
  });

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Metadata/operation/upload-metadata-yaml */
  async uploadMetadataYaml(id: string, yaml: string) {
    const formData = filesFormData("file", yamlAsFile("metadata.yaml", yaml));
    const response = await this.axios.put<MinkResponse>(
      "metadata/config/upload/" + id,
      formData,
    );
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Metadata/operation/download-metadata-yaml */
  async downloadMetadataYaml(id: string) {
    const response = await this.axios
      .get<string>("metadata/config/download/" + id)
      .catch((error) => {
        // 404 means no metadata yaml which is fine, rethrow other errors.
        if (error.response?.status == 404) return undefined;
        throw error;
      });
    return response?.data;
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Resources/operation/list-resource-statuses */
  async listResourceStatuses() {
    const response = await this.axios.get<MinkResponse<ResourceStatusListData>>(
      "resource/status/list",
    );
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Resources/operation/get-resource-status */
  getResourceStatus = deduplicateRequest(async (id: string) => {
    const response = await this.axios.get<MinkResponse<ResourceInfo>>(
      "resource/status/get/" + id,
    );
    return response.data;
  });

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Process-Corpus/operation/run-sparv */
  async runSparv(id: string) {
    const response = await this.axios.put<MinkResponse<ResourceInfo>>(
      "corpus/job/run/" + id,
      null,
      // Errors are okay.
      { validateStatus: () => true },
    );
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Process-Corpus/operation/abort-job */
  async abortJob(id: string) {
    const response = await this.axios.post<MinkResponse<JobStateMap>>(
      "corpus/job/abort/" + id,
    );
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Process-Corpus/operation/clear-annotations */
  async clearAnnotations(id: string) {
    const response = await this.axios.delete<MinkResponse>(
      "corpus/annotations/remove/" + id,
    );
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Exports/operation/list-exports */
  listExports = deduplicateRequest(async (id: string) => {
    const response = await this.axios.get<MinkResponse<ListExportsData>>(
      "corpus/exports/list/" + id,
    );
    return response.data.contents;
  });

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Exports/operation/download-exports */
  async downloadExports(id: string) {
    const response = await this.axios
      .get<Blob>("corpus/exports/download/" + id, { responseType: "blob" })
      .catch(rethrowBlobError);
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Exports/operation/download-exports */
  async downloadExportFile(id: string, path: string) {
    const response = await this.axios
      .get<Blob>("corpus/exports/download/" + id, {
        params: { file: path, zip: false },
        responseType: "text",
      })
      .catch(rethrowBlobError);
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Process-Corpus/operation/install-korp */
  async installKorp(id: string) {
    const response = await this.axios.put<MinkResponse<ResourceInfo>>(
      "corpus/korp/install/" + id,
    );
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Process-Corpus/operation/install-strix */
  async installStrix(id: string) {
    const response = await this.axios.put<MinkResponse<ResourceInfo>>(
      "corpus/strix/install/" + id,
    );
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Process-Corpus/operation/uninstall-korp */
  async uninstallKorp(id: string) {
    const response = await this.axios.delete<MinkResponse>(
      "corpus/korp/uninstall/" + id,
    );
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Process-Corpus/operation/uninstall-strix */
  async uninstallStrix(id: string) {
    const response = await this.axios.delete<MinkResponse>(
      "corpus/strix/uninstall/" + id,
    );
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Admin-Mode/operation/admin-mode-status */
  async adminModeStatus() {
    const response =
      await this.axios.get<MinkResponse<AdminModeStatusData>>(
        "admin-mode-status",
      );
    return response.data.admin_mode_status;
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Admin-Mode/operation/admin-mode-on */
  async adminModeOn() {
    const response = await this.axios.post<MinkResponse>("admin-mode-on");
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Admin-Mode/operation/admin-mode-off */
  async adminModeOff() {
    const response = await this.axios.post<MinkResponse>("admin-mode-off");
    return response.data;
  }
}

/** API client singleton instance. */
export default new MinkApi();
