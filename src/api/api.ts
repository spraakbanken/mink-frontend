import Axios, { type AxiosInstance } from "axios";
import { once } from "es-toolkit";
import { deduplicateRequest, ensureTrailingSlash } from "@/util";
import type {
  MinkResponse,
  InfoData,
  ResourceListData,
  CreateResourceData,
  ResourceStatusListData,
  ListExportsData,
  AdminModeStatusData,
  ProgressHandler,
  SparvSchemaData,
  SparvExportsData,
  ResourceInfo,
  ResourceType,
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

  /**
   * @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Corpora/operation/create-corpus
   * @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Lexicons/operation/create-lexicon
   */
  async createResource(type: ResourceType) {
    const response = await this.axios.post<MinkResponse<CreateResourceData>>(
      `${type}/create`,
    );
    return response.data.resource_id;
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Metadata/operation/create-metadata */
  async createMetadata(publicId: string) {
    const response = await this.axios.post<MinkResponse<CreateResourceData>>(
      "metadata/create",
      undefined,
      { params: { public_id: publicId } },
    );
    return response.data.resource_id;
  }

  /**
   * @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Corpora/operation/remove-corpus
   * @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Metadata/operation/remove-metadata
   * @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Lexicons/operation/remove-lexicon
   */
  async removeResource(type: ResourceType, id: string) {
    const response = await this.axios.delete<MinkResponse>(
      `${type}/remove/${id}`,
    );
    return response.data;
  }

  /**
   * @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Corpora/operation/upload-corpus-config
   * @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Lexicons/operation/upload-lexicon-config
   * @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Metadata/operation/upload_metadata_yaml_metadata_config_upload__resource_id__put
   */
  async uploadConfig(type: ResourceType, id: string, config: string) {
    const formData = filesFormData("file", yamlAsFile("config.yaml", config));
    const response = await this.axios.put<MinkResponse>(
      `${type}/config/upload/${id}`,
      formData,
    );
    return response.data;
  }

  /**
   * @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Corpora/operation/download-corpus-sources
   * @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Lexicons/operation/download-lexicon-sources
   */
  async downloadSources<B extends boolean>(
    type: ResourceType,
    id: string,
    filename: string,
    binary: B,
  ) {
    const response = await this.axios
      .get<B extends true ? Blob : string>(`${type}/sources/download/${id}`, {
        params: { file: filename, zip: false },
        responseType: binary ? "blob" : "text",
      })
      .catch(rethrowBlobError);
    return response.data;
  }

  /**
   * @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Corpora/operation/upload-corpus-sources
   * @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Lexicons/operation/upload-lexicon-sources
   */
  async uploadSources(
    type: ResourceType,
    id: string,
    files: File[],
    onProgress?: ProgressHandler,
  ) {
    const formData =
      type == "corpus"
        ? filesFormData("files", ...files)
        : filesFormData("file", ...files);
    const response = await this.axios.put<MinkResponse>(
      `${type}/sources/upload/${id}`,
      formData,
      { onUploadProgress: onProgress },
    );
    return response.data;
  }

  /**
   * @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Corpora/operation/remove-corpus-sources
   * @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Lexicons/operation/remove-lexicon-sources
   */
  async removeSource(type: ResourceType, id: string, name: string) {
    const response = await this.axios.delete<MinkResponse>(
      `${type}/sources/remove/${id}`,
      { params: { remove: name } },
    );
    return response.data;
  }

  /**
   * @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Corpora/operation/download-corpus-config
   * @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Lexicons/operation/download-lexicon-config
   * @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Metadata/operation/download_metadata_yaml_metadata_config_download__resource_id__get
   */
  downloadConfig = deduplicateRequest(
    async (type: ResourceType, id: string) => {
      const response = await this.axios
        .get<string>(`${type}/config/download/${id}`)
        .catch((error) => {
          // 404 means no config which is fine, rethrow other errors.
          if (error.response?.status == 404) return undefined;
          throw error;
        });
      return response?.data;
    },
  );

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

  /**
   * @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Corpora/operation/run-corpus-job
   * @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Lexicons/operation/run-lexicon-job
   */
  async runJob(type: ResourceType, id: string) {
    const response = await this.axios.put<MinkResponse<ResourceInfo>>(
      `${type}/job/run/${id}`,
      null,
      // Errors are okay.
      { validateStatus: () => true },
    );
    return response.data;
  }

  /**
   * @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Corpora/operation/abort-corpus-job
   * @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Lexicons/operation/abort-lexicon-job
   */
  async abortJob(type: ResourceType, id: string) {
    const response = await this.axios.post<MinkResponse>(
      `${type}/job/abort/${id}`,
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

  /**
   * @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Corpora/operation/list-corpus-exports
   * @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Lexicons/operation/list-lexicon-exports
   */
  listExports = deduplicateRequest(async (type: ResourceType, id: string) => {
    const response = await this.axios.get<MinkResponse<ListExportsData>>(
      `${type}/exports/list/${id}`,
    );
    return response.data.contents;
  });

  /**
   * @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Corpora/operation/download-corpus-exports
   * @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Lexicons/operation/download-lexicon-exports
   */
  async downloadExports(type: ResourceType, id: string) {
    const response = await this.axios
      .get<Blob>(`${type}/exports/download/${id}`, { responseType: "blob" })
      .catch(rethrowBlobError);
    return response.data;
  }

  /**
   * @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Corpora/operation/download-corpus-exports
   * @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Lexicons/operation/download-lexicon-exports
   */
  async downloadExportFile(type: ResourceType, id: string, path: string) {
    const response = await this.axios
      .get<Blob>(`${type}/exports/download/${id}`, {
        params: { file: path, zip: false },
        responseType: "text",
      })
      .catch(rethrowBlobError);
    return response.data;
  }

  /**
   * @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Corpora/operation/install-korp
   * @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Corpora/operation/install-strix
   * @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Lexicons/operation/install-karps
   */
  async install(type: ResourceType, id: string, tool: string) {
    const response = await this.axios.put<MinkResponse<ResourceInfo>>(
      `${type}/${tool}/install/${id}`,
    );
    return response.data;
  }

  /**
   * @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Corpora/operation/uninstall-korp
   * @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Corpora/operation/uninstall-strix
   * @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Lexicons/operation/uninstall-karps
   */
  async uninstall(type: ResourceType, id: string, tool: string) {
    const response = await this.axios.delete<MinkResponse>(
      `${type}/${tool}/uninstall/${id}`,
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
