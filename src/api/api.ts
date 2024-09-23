import Axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type Method,
} from "axios";
import { ensureTrailingSlash } from "@/util";
import type {
  MinkResponse,
  InfoData,
  ListCorporaData,
  CreateCorpusData,
  ResourceInfoAllData,
  ResourceInfoOneData,
  JobState,
  JobType,
  ListExportsData,
  AdminModeStatusData,
  CreateMetadataData,
  ProgressHandler,
} from "@/api/api.types";

/** Create a `text/yaml` file object with content */
const yamlAsFile = (filename: string, yaml: string): File =>
  new File([yaml], filename, { type: "text/yaml" });

/** Create a form data object with one or more files under `"files[]"` */
function filesFormData(...files: File[]): FormData {
  const formData = new FormData();
  files.forEach((file) => formData.append("files[]", file));
  return formData;
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

  /**
   * Helper for calling the Mink API.
   * @throws {MinkResponse} If an error happened in the backend app.
   */
  async call<T>(
    path: string,
    params: Record<string, string> = {},
    method: Method = "GET",
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const configFull = { method, url: path, params, ...config };
    return this.axios
      .request<T>(configFull)
      .then((response) => response.data)
      .catch(async (error) => {
        // We can only use response data if the request is completed at all
        if (!error.response?.data) throw error;
        const data = error.response.data;
        // If the data expected on success is blob, the error JSON will be coded as blob too, so it has to be decoded
        throw data instanceof Blob
          ? (JSON.parse(await data.text()) as MinkResponse)
          : data;
      });
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/api-doc#tag/Documentation/operation/APIinfo */
  async getInfo() {
    return this.call<MinkResponse<InfoData>>("info");
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/api-doc#tag/Manage-Corpora/operation/listcorpora */
  async listCorpora() {
    const data = await this.call<MinkResponse<ListCorporaData>>("list-corpora");
    return data.corpora;
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/api-doc#tag/Manage-Corpora/operation/createcorpus */
  async createCorpus() {
    type R = MinkResponse<CreateCorpusData>;
    const data = await this.call<R>("create-corpus", {}, "POST");
    return data.corpus_id;
  }

  async createMetadata(publicId: string) {
    type R = MinkResponse<CreateMetadataData>;
    const params = { public_id: publicId };
    const data = await this.call<R>("create-metadata", params);
    return data.resource_id;
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/api-doc#tag/Manage-Corpora/operation/removecorpus */
  async removeCorpus(corpusId: string) {
    const params = { corpus_id: corpusId };
    return await this.call("remove-corpus", params, "DELETE");
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/api-doc#tag/Manage-Metadata/operation/removemetadata */
  async removeMetadata(resourceId: string) {
    const params = { corpus_id: resourceId };
    return this.call("remove-metadata", params, "DELETE");
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/api-doc#tag/Manage-Config/operation/uploadconfig */
  async uploadConfig(corpusId: string, config: string) {
    const params = { corpus_id: corpusId };
    const data = filesFormData(yamlAsFile(config, "config.yaml"));
    return this.call("upload-config", params, "PUT", { data });
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/api-doc#tag/Manage-Sources/operation/downloadsources */
  async downloadSources(corpusId: string, filename: string, binary = false) {
    const params = { corpus_id: corpusId, file: filename, zip: "false" };
    return this.call<string>("download-sources", params, "GET", {
      responseType: binary ? "arraybuffer" : "text",
    });
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/api-doc#tag/Manage-Exports/operation/downloadsourcetext */
  async downloadSourceText(corpusId: string, filename: string) {
    const params = { corpus_id: corpusId, file: filename };
    return this.call<string>("download-source-text", params);
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/api-doc#tag/Manage-Sources/operation/uploadsources */
  async uploadSources(
    corpusId: string,
    files: File[],
    onProgress?: ProgressHandler,
  ) {
    const params = { corpus_id: corpusId };
    const data = filesFormData(...files);
    const config = { data, onUploadProgress: onProgress };
    return this.call("upload-sources", params, "PUT", config);
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/api-doc#tag/Manage-Sources/operation/removesources */
  async removeSource(corpusId: string, name: string) {
    const params = { corpus_id: corpusId, remove: name };
    return this.call("remove-sources", params, "DELETE");
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/api-doc#tag/Manage-Config/operation/downloadconfig */
  async downloadConfig(corpusId: string) {
    const params = { corpus_id: corpusId };
    return this.call<string>("download-config", params);
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/api-doc#tag/Manage-Metadata/operation/uploadmetadatayaml */
  async uploadMetadataYaml(resourceId: string, yaml: string) {
    const params = { corpus_id: resourceId };
    const file = yamlAsFile("metadata.yaml", yaml);
    const data = filesFormData(file);
    return this.call("upload-metadata-yaml", params, "PUT", { data });
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/api-doc#tag/Manage-Metadata/operation/downloadmetadatayaml */
  async downloadMetadataYaml(resourceId: string) {
    const params = { corpus_id: resourceId };
    return this.call<string>("download-metadata-yaml", params);
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/api-doc#tag/Process-Corpus/operation/resourceinfo */
  async resourceInfoAll() {
    return this.call<MinkResponse<ResourceInfoAllData>>("resource-info");
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/api-doc#tag/Process-Corpus/operation/resourceinfo */
  async resourceInfoOne(corpusId: string) {
    type R = MinkResponse<ResourceInfoOneData>;
    const params = { corpus_id: corpusId };
    return this.call<R>("resource-info", params);
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/api-doc#tag/Process-Corpus/operation/runSparv */
  async runSparv(corpusId: string) {
    type R = MinkResponse<ResourceInfoOneData>;
    const params = { corpus_id: corpusId };
    const call = this.call<R>("run-sparv", params, "PUT");
    // Errors are okay.
    // TODO Use the `validateStatus` config option instead
    return call.catch((error) => error.response);
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/api-doc#tag/Process-Corpus/operation/abortjob */
  async abortJob(corpusId: string) {
    type R = MinkResponse<Record<JobType, JobState>>;
    const params = { corpus_id: corpusId };
    this.call<R>("abort-job", params, "POST");
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/api-doc#tag/Manage-Exports/operation/listexports */
  async listExports(corpusId: string) {
    type R = MinkResponse<ListExportsData>;
    const params = { corpus_id: corpusId };
    const data = await this.call<R>("list-exports", params);
    return data.contents;
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/api-doc#tag/Manage-Exports/operation/downloadexports */
  async downloadExports(corpusId: string) {
    const params = { corpus_id: corpusId };
    const config: AxiosRequestConfig = { responseType: "blob" };
    return this.call<Blob>("download-exports", params, "GET", config);
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/api-doc#tag/Manage-Exports/operation/downloadexports */
  async downloadExportFile(corpusId: string, path: string) {
    const params = { corpus_id: corpusId, file: path, zip: "false" };
    const config: AxiosRequestConfig = { responseType: "blob" };
    return this.call<Blob>("download-exports", params, "GET", config);
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/api-doc#tag/Process-Corpus/operation/installinKorp */
  async installKorp(corpusId: string) {
    type R = MinkResponse<ResourceInfoOneData>;
    const params = { corpus_id: corpusId };
    return this.call<R>("install-korp", params, "PUT");
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/api-doc#tag/Process-Corpus/operation/installinStrix */
  async installStrix(corpusId: string) {
    type R = MinkResponse<ResourceInfoOneData>;
    const params = { corpus_id: corpusId };
    return this.call<R>("install-strix", params, "PUT");
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/api-doc#tag/Admin-Mode/operation/adminmodestatus */
  async adminModeStatus() {
    type R = MinkResponse<AdminModeStatusData>;
    const data = await this.call<R>("admin-mode-status");
    return data.admin_mode_status;
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/api-doc#tag/Admin-Mode/operation/adminmodeon */
  async adminModeOn() {
    return this.call("admin-mode-on", {}, "POST");
  }

  /** @see https://ws.spraakbanken.gu.se/ws/mink/api-doc#tag/Admin-Mode/operation/adminmodeoff */
  async adminModeOff() {
    return this.call("admin-mode-off", {}, "POST");
  }
}

/** API client singleton instance. */
export default new MinkApi();
