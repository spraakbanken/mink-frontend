import Axios, { type AxiosInstance } from "axios";
import { once } from "es-toolkit";
import { deduplicateRequest, ensureTrailingSlash } from "@/util";
import type {
  MinkResponse,
  InfoData,
  ListCorporaData,
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

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Corpora/operation/list-corpora */
  async listCorpora() {
    const response =
      await this.axios.get<MinkResponse<ListCorporaData>>("corpus/list");
    return response.data.corpora;
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
  async removeCorpus(corpusId: string) {
    const response = await this.axios.delete<MinkResponse>(
      "corpus/remove/" + corpusId,
    );
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Metadata/operation/remove-metadata */
  async removeMetadata(resourceId: string) {
    const response = await this.axios.delete<MinkResponse>(
      "metadata/remove/" + resourceId,
    );
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Config/operation/upload-config */
  async uploadConfig(resourceId: string, config: string) {
    const formData = filesFormData("file", yamlAsFile("config.yaml", config));
    const response = await this.axios.put<MinkResponse>(
      "corpus/config/upload/" + resourceId,
      formData,
    );
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Sources/operation/download-sources */
  async downloadSources<B extends boolean>(
    resourceId: string,
    filename: string,
    binary: B,
  ) {
    const response = await this.axios
      .get<B extends true ? Blob : string>(
        "corpus/sources/download/" + resourceId,
        {
          params: { file: filename, zip: false },
          responseType: binary ? "blob" : "text",
        },
      )
      .catch(rethrowBlobError);
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Sources/operation/upload-sources */
  async uploadSources(
    corpusId: string,
    files: File[],
    onProgress?: ProgressHandler,
  ) {
    const formData = filesFormData("files", ...files);
    const response = await this.axios.put<MinkResponse>(
      "corpus/sources/upload/" + corpusId,
      formData,
      { onUploadProgress: onProgress },
    );
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Sources/operation/remove-sources */
  async removeSource(resourceId: string, name: string) {
    const response = await this.axios.delete<MinkResponse>(
      "corpus/sources/remove/" + resourceId,
      {
        params: { remove: name },
      },
    );
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Config/operation/download-config */
  downloadConfig = deduplicateRequest(async (corpusId: string) => {
    const response = await this.axios
      .get<string>("corpus/config/download/" + corpusId)
      .catch((error) => {
        // 404 means no config which is fine, rethrow other errors.
        if (error.response?.status == 404) return undefined;
        throw error;
      });
    return response?.data;
  });

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Metadata/operation/upload-metadata-yaml */
  async uploadMetadataYaml(resourceId: string, yaml: string) {
    const formData = filesFormData("file", yamlAsFile("metadata.yaml", yaml));
    const response = await this.axios.put<MinkResponse>(
      "metadata/config/upload/" + resourceId,
      formData,
    );
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Metadata/operation/download-metadata-yaml */
  async downloadMetadataYaml(resourceId: string) {
    const response = await this.axios
      .get<string>("metadata/config/download/" + resourceId)
      .catch((error) => {
        // 404 means no metadata yaml which is fine, rethrow other errors.
        if (error.response?.status == 404) return undefined;
        throw error;
      });
    return response?.data;
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Resources/operation/list-resource-statuses */
  async resourceStatusList() {
    const response = await this.axios.get<MinkResponse<ResourceStatusListData>>(
      "resource/status/list",
    );
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Resources/operation/get-resource-status */
  resourceStatusGet = deduplicateRequest(async (resourceId: string) => {
    const response = await this.axios.get<MinkResponse<ResourceInfo>>(
      "resource/status/get/" + resourceId,
    );
    return response.data;
  });

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Process-Corpus/operation/run-sparv */
  async runSparv(corpusId: string) {
    const response = await this.axios.put<MinkResponse<ResourceInfo>>(
      "corpus/job/run/" + corpusId,
      null,
      {
        // Errors are okay.
        validateStatus: () => true,
      },
    );
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Process-Corpus/operation/abort-job */
  async abortJob(corpusId: string) {
    const response = await this.axios.post<MinkResponse<JobStateMap>>(
      "corpus/job/abort/" + corpusId,
    );
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Process-Corpus/operation/clear-annotations */
  async clearAnnotations(corpusId: string) {
    const response = await this.axios.delete<MinkResponse>(
      "corpus/annotations/remove/" + corpusId,
    );
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Exports/operation/list-exports */
  async listExports(corpusId: string) {
    const response = await this.axios.get<MinkResponse<ListExportsData>>(
      "corpus/exports/list/" + corpusId,
    );
    return response.data.contents;
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Exports/operation/download-exports */
  async downloadExports(corpusId: string) {
    const response = await this.axios
      .get<Blob>("corpus/exports/download/" + corpusId, {
        responseType: "blob",
      })
      .catch(rethrowBlobError);
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Manage-Exports/operation/download-exports */
  async downloadExportFile(corpusId: string, path: string) {
    const response = await this.axios
      .get<Blob>("corpus/exports/download/" + corpusId, {
        params: { file: path, zip: false },
        responseType: "text",
      })
      .catch(rethrowBlobError);
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Process-Corpus/operation/install-korp */
  async installKorp(corpusId: string) {
    const response = await this.axios.put<MinkResponse<ResourceInfo>>(
      "corpus/korp/install/" + corpusId,
    );
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Process-Corpus/operation/install-strix */
  async installStrix(corpusId: string) {
    const response = await this.axios.put<MinkResponse<ResourceInfo>>(
      "corpus/strix/install/" + corpusId,
    );
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Process-Corpus/operation/uninstall-korp */
  async uninstallKorp(corpusId: string) {
    const response = await this.axios.delete<MinkResponse>(
      "corpus/korp/uninstall/" + corpusId,
    );
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/dev/redoc#tag/Process-Corpus/operation/uninstall-strix */
  async uninstallStrix(corpusId: string) {
    const response = await this.axios.delete<MinkResponse>(
      "corpus/strix/uninstall/" + corpusId,
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
