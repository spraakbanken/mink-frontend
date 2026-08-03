import Axios, { isAxiosError, type AxiosInstance } from "axios";
import { once } from "es-toolkit";
import { ApiRequest } from "./request";
import { deduplicateRequest, ensureTrailingSlash } from "@/util";
import type {
  MinkResponse,
  InfoData,
  ResourceListData,
  CreateResourceData,
  ResourceStatusListData,
  ListExportsData,
  ProgressHandler,
  SparvSchemaData,
  SparvExportsData,
  ResourceInfo,
  ResourceType,
  BackendError,
  UserData,
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

/** Check if the given error is an Axios error with a Mink response. */
export function isBackendError(err: unknown): err is BackendError {
  if (!isAxiosError(err) || !err.response?.data) return false;
  const data = err.response.data;
  return "status" in data && "return_code" in data && "message" in data;
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
export class MinkClient {
  /** @deprecated An instance of the Axios HTTP client. */
  axios: AxiosInstance;
  baseUrl: string;
  jwt?: string;

  /** Creates the client instance */
  constructor(baseUrl: string) {
    this.axios = Axios.create({
      baseURL: ensureTrailingSlash(baseUrl),
      withCredentials: true,
    });
    this.baseUrl = ensureTrailingSlash(baseUrl);
  }

  /** Sets a JWT token which is then used to authenticate API requests. */
  setJwt(jwt?: string) {
    this.axios.defaults.headers["Authorization"] = jwt ? `Bearer ${jwt}` : null;
    this.jwt = jwt;
  }

  /** Send an (authenticated) Mink backend request */
  request(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    config: RequestInit = {},
  ) {
    // Prepare request config
    config.method = method;
    config.credentials = "include";
    if (this.jwt) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${this.jwt}`,
      };
    }

    // Build URL
    const url = this.baseUrl + endpoint;

    // Send request
    return new ApiRequest(url, config);
  }

  get(endpoint: string) {
    return this.request(endpoint);
  }

  post(endpoint: string) {
    return this.request(endpoint, "POST");
  }

  put(endpoint: string, body?: BodyInit) {
    return this.request(endpoint, "PUT", { body });
  }

  /** @see https://ws.spraakbanken.gu.se/docs/mink#tag/Documentation/operation/info */
  getInfo = once(async () => await this.request("info").json<InfoData>());

  /** @see https://ws.spraakbanken.gu.se/docs/mink#tag/Documentation/operation/list-sparv-exports */
  sparvExports = once(async () => {
    const request = this.request("corpus/sparv/list-exports");
    const data = await request.json<SparvExportsData>();
    return data.exports;
  });

  /** @see https://ws.spraakbanken.gu.se/docs/mink#tag/Documentation/operation/get-sparv-schema */
  sparvSchema = once(async () => {
    const request = this.request("corpus/sparv/get-schema");
    const data = await request.json<SparvSchemaData>();
    return data.sparv_schema;
  });

  /** @see https://ws.spraakbanken.gu.se/docs/mink#tag/User-Management/operation/get-user-info */
  async getUserInfo() {
    const request = this.request("user/info/get");
    const data = await request.json<UserData>();
    return data.user;
  }

  /** @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Resources/operation/list-resources */
  async listResources() {
    const request = this.request("resource/list");
    const data = await request.json<ResourceListData>();
    return data.resources;
  }

  /**
   * @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Corpora/operation/create-corpus
   * @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Lexicons/operation/create-lexicon
   */
  async createResource(type: ResourceType) {
    const request = this.request(`${type}/create`, "POST");
    const data = await request.json<CreateResourceData>();
    return data.resource_id;
  }

  /** @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Metadata/operation/create-metadata */
  async createMetadata(publicId: string) {
    const request = this.request("metadata/create", "POST");
    request.setParams({ public_id: publicId });
    const data = await request.json<CreateResourceData>();
    return data.resource_id;
  }

  /**
   * @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Corpora/operation/remove-corpus
   * @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Metadata/operation/remove-metadata
   * @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Lexicons/operation/remove-lexicon
   */
  async removeResource(type: ResourceType, id: string) {
    const request = this.request(`${type}/remove/${id}`, "DELETE");
    request.send();
  }

  /**
   * @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Corpora/operation/upload-corpus-config
   * @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Lexicons/operation/upload-lexicon-config
   * @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Metadata/operation/upload_metadata_yaml_metadata_config_upload__resource_id__put
   */
  async uploadConfig(
    type: ResourceType,
    id: string,
    config: string,
    custom: boolean,
  ) {
    const formData = filesFormData("file", yamlAsFile("config.yaml", config));
    const request = this.request(`${type}/config/upload/${id}`, "PUT", {
      body: formData,
    });
    request.setParams({ "custom-config": custom ? "true" : "false" });
    await request.send();
  }

  /**
   * @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Corpora/operation/download-corpus-sources
   * @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Lexicons/operation/download-lexicon-sources
   */
  async downloadSources<B extends boolean>(
    type: ResourceType,
    id: string,
    filename: string,
    binary: B,
  ) {
    const request = this.request(`${type}/sources/download/${id}`);
    request.setParams({ file: filename, zip: "false" });
    // TODO Handle error? Was: rethrowBlobError
    return binary ? request.blob() : request.text();
  }

  /**
   * @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Corpora/operation/upload-corpus-sources
   * @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Lexicons/operation/upload-lexicon-sources
   */
  async uploadSources(
    type: ResourceType,
    id: string,
    files: File[],
    onProgress?: ProgressHandler,
  ) {
    const formData = filesFormData("files", ...files);
    const request = this.request(`${type}/sources/upload/${id}`, "PUT", {
      body: formData,
      // @ts-expect-error TODO Upload progress not supported by fetch()
      onUploadProgress: onProgress,
    });
    await request.send();
  }

  /**
   * @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Corpora/operation/remove-corpus-sources
   * @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Lexicons/operation/remove-lexicon-sources
   */
  async removeSource(type: ResourceType, id: string, name: string) {
    const request = this.request(`${type}/sources/remove/${id}`, "DELETE");
    request.setParams({ remove: name });
    await request.send();
  }

  /**
   * @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Corpora/operation/download-corpus-config
   * @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Lexicons/operation/download-lexicon-config
   * @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Metadata/operation/download_metadata_yaml_metadata_config_download__resource_id__get
   */
  downloadConfig = deduplicateRequest(
    async (type: ResourceType, id: string) => {
      const request = this.request(`${type}/config/download/${id}`);
      return await request.text().catch((error) => {
        // 404 means no config which is fine, rethrow other errors.
        if (error.response?.status == 404) return undefined;
        throw error;
      });
    },
  );

  /** @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Resources/operation/list-resource-statuses */
  async listResourceStatuses() {
    const request = this.request("resource/status/list");
    return await request.json<ResourceStatusListData>();
  }

  /** @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Resources/operation/get-resource-status */
  getResourceStatus = deduplicateRequest(async (id: string) => {
    const request = this.request("resource/status/get/" + id);
    return request.json<ResourceInfo>();
  });

  /**
   * @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Corpora/operation/run-corpus-job
   * @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Lexicons/operation/run-lexicon-job
   */
  async runJob(type: ResourceType, id: string) {
    const request = this.request(`${type}/job/run/${id}`, "PUT");
    // TODO Errors are okay
    return request.json<ResourceInfo>();
  }

  /**
   * @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Corpora/operation/abort-corpus-job
   * @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Lexicons/operation/abort-lexicon-job
   */
  async abortJob(type: ResourceType, id: string) {
    const response = await this.axios.post<MinkResponse>(
      `${type}/job/abort/${id}`,
    );
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Corpora/operation/clear-corpus-annotations */
  async clearAnnotations(id: string) {
    const response = await this.axios.delete<MinkResponse>(
      "corpus/annotations/remove/" + id,
    );
    return response.data;
  }

  /**
   * @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Corpora/operation/list-corpus-exports
   * @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Lexicons/operation/list-lexicon-exports
   */
  listExports = deduplicateRequest(async (type: ResourceType, id: string) => {
    const response = await this.axios.get<MinkResponse<ListExportsData>>(
      `${type}/exports/list/${id}`,
    );
    return response.data.contents;
  });

  /**
   * @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Corpora/operation/download-corpus-exports
   * @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Lexicons/operation/download-lexicon-exports
   */
  async downloadExports(type: ResourceType, id: string) {
    const response = await this.axios
      .get<Blob>(`${type}/exports/download/${id}`, { responseType: "blob" })
      .catch(rethrowBlobError);
    return response.data;
  }

  /**
   * @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Corpora/operation/download-corpus-exports
   * @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Lexicons/operation/download-lexicon-exports
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
   * @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Corpora/operation/install-korp
   * @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Corpora/operation/install-strix
   * @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Lexicons/operation/install-karps
   */
  async install(type: ResourceType, id: string, tool: string) {
    const response = await this.axios.put<MinkResponse<ResourceInfo>>(
      `${type}/${tool}/install/${id}`,
    );
    return response.data;
  }

  /**
   * @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Corpora/operation/uninstall-korp
   * @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Corpora/operation/uninstall-strix
   * @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Lexicons/operation/uninstall-karps
   */
  async uninstall(type: ResourceType, id: string, tool: string) {
    const response = await this.axios.delete<MinkResponse>(
      `${type}/${tool}/uninstall/${id}`,
    );
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/docs/mink#tag/User-Management/operation/activate-admin-mode */
  async adminModeOn() {
    const response = await this.axios.post<MinkResponse>(
      "user/admin-mode/activate",
    );
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/docs/mink#tag/User-Management/operation/deactivate-admin-mode */
  async adminModeOff() {
    const response = await this.axios.post<MinkResponse>(
      "user/admin-mode/deactivate",
    );
    return response.data;
  }
}
