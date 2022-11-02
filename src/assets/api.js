import Axios from "axios";

/** Mink backend API client */
class MinkApi {
  /** Creates the client instance */
  constructor(jwt) {
    this.axios = Axios.create({
      baseURL: "https://ws.spraakbanken.gu.se/ws/min-sb/",
      withCredentials: true,
    });
    this.setJwt(jwt);
  }

  /** Sets a JWT token which is then used to authenticate API requests. */
  setJwt(jwt) {
    this.jwt = jwt;
    this.axios.defaults.headers["Authorization"] = jwt
      ? `Bearer ${jwt}`
      : undefined;
  }

  async listCorpora() {
    const response = await this.axios.get("list-corpora");
    return response.data.corpora;
  }

  async createCorpus() {
    const response = await this.axios.post("create-corpus", null, {});
    return response.data.corpus_id;
  }

  removeCorpus(corpusId) {
    return this.axios.delete("remove-corpus", {
      params: { corpus_id: corpusId },
    });
  }

  uploadConfig(corpusId, config) {
    const configFile = new File([config], "config.yaml", { type: "text/yaml" });
    const formData = new FormData();
    formData.append("files[]", configFile);
    return this.axios.put("upload-config", formData, {
      params: { corpus_id: corpusId },
    });
  }

  async listSources(corpusId) {
    const response = await this.axios.get("list-sources", {
      params: { corpus_id: corpusId },
    });
    return response.data.contents;
  }

  async downloadSourceFile(corpusId, filename) {
    const response = await this.axios.get("download-sources", {
      params: { corpus_id: corpusId, file: filename, zip: false },
    });
    return response.data;
  }

  async downloadSourceText(corpusId, filename) {
    const response = await this.axios.get("download-source-text", {
      params: { corpus_id: corpusId, file: filename },
    });
    return response.data;
  }

  uploadSources(corpusId, files) {
    const formData = new FormData();
    [...files].forEach((file) => formData.append("files[]", file));
    return this.axios
      .put("upload-sources", formData, {
        params: { corpus_id: corpusId },
      })
      .catch((error) => {
        if (error.response) throw TypeError(error.response.data.info);
      });
  }

  removeSource(corpusId, name) {
    return this.axios.delete("remove-sources", {
      params: { corpus_id: corpusId, remove: name },
    });
  }

  async downloadConfig(corpusId) {
    const response = await this.axios.get("download-config", {
      params: { corpus_id: corpusId },
    });
    return response.data;
  }

  /**
   * @returns {job_status, message, status} job_status can be: none, syncing_corpus,
   *   waiting, annotating, done_annotating, syncing_results, done, error, aborted.
   */
  async checkStatus(corpusId) {
    const response = await this.axios.get("check-status", {
      params: { corpus_id: corpusId },
    });
    return response.data;
  }

  async runSparv(corpusId) {
    return await this.axios
      .put("run-sparv", null, { params: { corpus_id: corpusId } })
      // Errors are okay.
      .catch((reason) => reason.response)
      .then((response) => response.data);
  }

  abortJob(corpusId) {
    return this.axios.post("abort-job", null, {
      params: { corpus_id: corpusId },
    });
  }

  async listExports(corpusId) {
    const response = await this.axios.get("list-exports", {
      params: { corpus_id: corpusId },
    });
    return response.data.contents;
  }

  async downloadExports(corpusId) {
    const response = await this.axios.get("download-exports", {
      params: { corpus_id: corpusId },
      responseType: "blob",
    });
    return response.data;
  }

  async downloadExportFile(corpusId, path) {
    const response = await this.axios.get("download-exports", {
      params: {
        corpus_id: corpusId,
        file: path,
        zip: false,
      },
      responseType: "blob",
    });
    return response.data;
  }

  async installCorpus(corpusId) {
    const response = await this.axios.put("install-corpus", null, {
      params: { corpus_id: corpusId },
    });
    return response.data;
  }

  async adminModeOn() {
    const response = await this.axios.post("admin-mode-on");
    return response.data;
  }

  async adminModeOff() {
    const response = await this.axios.post("admin-mode-off");
    return response.data;
  }
}

/** API client singleton instance. */
export const api = new MinkApi();

export const isStatusStarted = (status) => STATUSES[status]?.started;
export const isStatusRunning = (status) => STATUSES[status]?.running;
export const isStatusDone = (status) =>
  ["done_syncing", "done_installing"].includes(status);
export const isStatusInstalled = (status) => status == "done_installing";
export const isStatusError = (status) => status == "error";

// prettier-ignore
const STATUSES = {
  none:             { started: false, running: false },
  syncing_corpus:   { started:  true, running:  true },
  waiting:          { started:  true, running:  true },
  annotating:       { started:  true, running:  true },
  done_annotating:  { started:  true, running:  true },
  syncing_results:  { started:  true, running:  true },
  done_syncing:     { started:  true, running: false },
  error:            { started:  true, running: false },
  aborted:          { started: false, running: false },
  waiting_install:  { started:  true, running:  true },
  installing:       { started:  true, running:  true },
  done_installing:  { started:  true, running: false },
};
