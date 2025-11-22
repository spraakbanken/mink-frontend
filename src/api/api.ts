import Axios, { type AxiosInstance } from "axios";
import { once } from "es-toolkit";
import { deduplicateRequest, ensureTrailingSlash } from "@/util";
import type {
  MinkResponse,
  InfoData,
  ListCorporaData,
  CreateCorpusData,
  ResourceInfoAllData,
  ResourceInfoOneData,
  ListExportsData,
  AdminModeStatusData,
  CreateMetadataData,
  ProgressHandler,
  JobStateMap,
  SparvSchemaData,
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

  /** @see https://ws.spraakbanken.gu.se/docs/mink#tag/Documentation/operation/info-get */
  getInfo = once(async () => {
    const response = await this.axios.get<MinkResponse<InfoData>>("info");
    return response.data;
  });

  /** @see https://ws.spraakbanken.gu.se/docs/mink#tag/Documentation/operation/sparv-schema-get */
  sparvSchema = once(async () => {
    const response =
      await this.axios.get<MinkResponse<SparvSchemaData>>("sparv-schema");
    return response.data.sparv_schema;
  });

  /** @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Corpora/operation/list-corpora-get */
  async listCorpora() {
    const response =
      await this.axios.get<MinkResponse<ListCorporaData>>("list-corpora");
    return response.data.corpora;
  }

  /** @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Corpora/operation/create-corpus-post */
  async createCorpus() {
    const response =
      await this.axios.post<MinkResponse<CreateCorpusData>>("create-corpus");
    return response.data.resource_id;
  }

  /** @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Metadata/operation/create-metadata-post */
  async createMetadata(publicId: string) {
    const response = await this.axios.post<MinkResponse<CreateMetadataData>>(
      "create-metadata",
      undefined,
      { params: { public_id: publicId } },
    );
    return response.data.resource_id;
  }

  /** @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Corpora/operation/remove-corpus-delete */
  async removeCorpus(corpusId: string) {
    const response = await this.axios.delete<MinkResponse>("remove-corpus", {
      params: { corpus_id: corpusId },
    });
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Metadata/operation/remove-metadata-delete */
  async removeMetadata(resourceId: string) {
    const response = await this.axios.delete<MinkResponse>("remove-metadata", {
      params: { corpus_id: resourceId },
    });
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Config/operation/upload-config-put */
  async uploadConfig(corpusId: string, config: string) {
    const formData = filesFormData("file", yamlAsFile("config.yaml", config));
    const response = await this.axios.put<MinkResponse>(
      "upload-config",
      formData,
      { params: { corpus_id: corpusId } },
    );
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Sources/operation/download-sources-get */
  async downloadSources<B extends boolean>(
    corpusId: string,
    filename: string,
    binary: B,
  ) {
    const response = await this.axios
      .get<B extends true ? Blob : string>("download-sources", {
        params: { corpus_id: corpusId, file: filename, zip: false },
        responseType: binary ? "blob" : "text",
      })
      .catch(rethrowBlobError);
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Exports/operation/download-source-text-get */
  async downloadSourceText(corpusId: string, filename: string) {
    const response = await this.axios.get<string>("download-source-text", {
      params: { corpus_id: corpusId, file: filename },
    });
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Sources/operation/upload-sources-put */
  async uploadSources(
    corpusId: string,
    files: File[],
    onProgress?: ProgressHandler,
  ) {
    const formData = filesFormData("files", ...files);
    const response = await this.axios.put<MinkResponse>(
      "upload-sources",
      formData,
      {
        params: { corpus_id: corpusId },
        onUploadProgress: onProgress,
      },
    );
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Sources/operation/remove-sources-delete */
  async removeSource(corpusId: string, name: string) {
    const response = await this.axios.delete<MinkResponse>("remove-sources", {
      params: { corpus_id: corpusId, remove: name },
    });
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Config/operation/download-config-get */
  downloadConfig = deduplicateRequest(async (corpusId: string) => {
    const response = await this.axios
      .get<string>("download-config", {
        params: { corpus_id: corpusId },
      })
      .catch((error) => {
        // 404 means no config which is fine, rethrow other errors.
        if (error.response?.status == 404) return undefined;
        throw error;
      });
    return response?.data;
  });

  /** @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Metadata/operation/upload-metadata-yaml-put */
  async uploadMetadataYaml(resourceId: string, yaml: string) {
    const formData = filesFormData("file", yamlAsFile("metadata.yaml", yaml));
    const response = await this.axios.put<MinkResponse>(
      "upload-metadata-yaml",
      formData,
      { params: { corpus_id: resourceId } },
    );
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Metadata/operation/download-metadata-yaml-get */
  async downloadMetaataYaml(resourceId: string) {
    const response = await this.axios
      .get<string>("download-metadata-yaml", {
        params: { corpus_id: resourceId },
      })
      .catch((error) => {
        // 404 means no metadata yaml which is fine, rethrow other errors.
        if (error.response?.status == 404) return undefined;
        throw error;
      });
    return response?.data;
  }

  /** @see https://ws.spraakbanken.gu.se/docs/mink#tag/Process-Corpus/operation/resource-info-get */
  async resourceInfoAll() {
    const response =
      await this.axios.get<MinkResponse<ResourceInfoAllData>>("resource-info");
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/docs/mink#tag/Process-Corpus/operation/resource-info-get */
  resourceInfoOne = deduplicateRequest(async (corpusId: string) => {
    const response = await this.axios.get<MinkResponse<ResourceInfoOneData>>(
      "resource-info",
      { params: { corpus_id: corpusId } },
    );
    return response.data;
  });

  /** @see https://ws.spraakbanken.gu.se/docs/mink#tag/Process-Corpus/operation/run-sparv-put */
  async runSparv(corpusId: string) {
    const response = await this.axios
      .put<MinkResponse<ResourceInfoOneData>>("run-sparv", null, {
        params: { corpus_id: corpusId },
      })
      // Errors are okay.
      .catch((reason) => reason.response);
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/docs/mink#tag/Process-Corpus/operation/abort-job-post */
  async abortJob(corpusId: string) {
    const response = await this.axios.post<MinkResponse<JobStateMap>>(
      "abort-job",
      null,
      { params: { corpus_id: corpusId } },
    );
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/docs/mink#tag/Process-Corpus/operation/clear-annotations-delete */
  async clearAnnotations(corpusId: string) {
    const response = await this.axios.delete<MinkResponse>(
      "clear-annotations",
      { params: { corpus_id: corpusId } },
    );
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Exports/operation/list-exports-get */
  async listExports(corpusId: string) {
    const response = await this.axios.get<MinkResponse<ListExportsData>>(
      "list-exports",
      { params: { corpus_id: corpusId } },
    );
    return response.data.contents;
  }

  /** @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Exports/operation/download-exports-get */
  async downloadExports(corpusId: string) {
    const response = await this.axios
      .get<Blob>("download-exports", {
        params: { corpus_id: corpusId },
        responseType: "blob",
      })
      .catch(rethrowBlobError);
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/docs/mink#tag/Manage-Exports/operation/download-exports-get */
  async downloadExportFile(corpusId: string, path: string) {
    const response = await this.axios
      .get<Blob>("download-exports", {
        params: { corpus_id: corpusId, file: path, zip: false },
        responseType: "blob",
      })
      .catch(rethrowBlobError);
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/docs/mink#tag/Process-Corpus/operation/install-korp-put */
  async installKorp(corpusId: string) {
    const response = await this.axios.put<MinkResponse<ResourceInfoOneData>>(
      "install-korp",
      null,
      { params: { resource_id: corpusId } },
    );
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/docs/mink#tag/Process-Corpus/operation/install-strix-put */
  async installStrix(corpusId: string) {
    const response = await this.axios.put<MinkResponse<ResourceInfoOneData>>(
      "install-strix",
      null,
      { params: { resource_id: corpusId } },
    );
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/docs/mink#tag/Process-Corpus/operation/uninstall-korp-delete */
  async uninstallKorp(corpusId: string) {
    const response = await this.axios.delete<MinkResponse>("uninstall-korp", {
      params: { resource_id: corpusId },
    });
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/docs/mink#tag/Process-Corpus/operation/uninstall-strix-delete */
  async uninstallStrix(corpusId: string) {
    const response = await this.axios.delete<MinkResponse>("uninstall-strix", {
      params: { resource_id: corpusId },
    });
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/docs/mink#tag/Admin-Mode/operation/admin-mode-status-get */
  async adminModeStatus() {
    const response =
      await this.axios.get<MinkResponse<AdminModeStatusData>>(
        "admin-mode-status",
      );
    return response.data.admin_mode_status;
  }

  /** @see https://ws.spraakbanken.gu.se/docs/mink#tag/Admin-Mode/operation/admin-mode-on-post */
  async adminModeOn() {
    const response = await this.axios.post<MinkResponse>("admin-mode-on");
    return response.data;
  }

  /** @see https://ws.spraakbanken.gu.se/docs/mink#tag/Admin-Mode/operation/admin-mode-off-post */
  async adminModeOff() {
    const response = await this.axios.post<MinkResponse>("admin-mode-off");
    return response.data;
  }
}

/** API client singleton instance. */
export default new MinkApi();
