import Axios from "axios";

const axios = Axios.create({
  baseURL: "https://ws.spraakbanken.gu.se/ws/min-sb/",
});

export function initialize(jwt) {
  axios.defaults.headers["Authorization"] = jwt ? `Bearer ${jwt}` : undefined;
}

export function listCorpora() {
  return axios.get("list-corpora").then((response) => response.data.corpora);
}

export function getCorpus(corpusId) {
  return axios
    .get("list-sources", { params: { corpus_id: corpusId } })
    .then((response) => response.data.contents);
}

export async function createCorpus() {
  const response = await axios.post("create-corpus", null, {});
  return response.data.corpus_id;
}

export function putSources(corpusId, files) {
  const formData = new FormData();
  [...files].forEach((file) => formData.append("files[]", file));
  return axios
    .put("upload-sources", formData, {
      params: { corpus_id: corpusId },
    })
    .catch((error) => {
      if (error.response) throw TypeError(error.response.data.info);
    });
}

export function removeSource(corpusId, name) {
  return axios.delete("remove-sources", {
    params: { corpus_id: corpusId, remove: name },
  });
}

export function getConfig(corpusId) {
  return axios
    .get("download-config", { params: { corpus_id: corpusId } })
    .then((response) => response.data);
}

export async function putConfig(corpusId, config) {
  const configFile = new File([config], "config.yaml", {
    type: "text/yaml",
  });
  const formData = new FormData();
  formData.append("files[]", configFile);

  await axios.put("upload-config", formData, {
    params: { corpus_id: corpusId },
  });
}

export async function queueJob(corpusId) {
  return await axios
    .put("run-sparv", null, { params: { corpus_id: corpusId } })
    // Errors are okay.
    .catch((reason) => reason.response)
    .then((response) => response.data);
}

export function abortJob(corpusId) {
  return axios.post("abort-job", null, { params: { corpus_id: corpusId } });
}

/**
 * @returns {job_status, message, status} job_status can be: none, syncing_corpus,
 *   waiting, annotating, done_annotating, syncing_results, done, error, aborted.
 */
export async function getJob(corpusId) {
  return (
    axios
      .get("check-status", { params: { corpus_id: corpusId } })
      // Errors are okay.
      .catch((reason) => reason.response)
      .then((response) => response.data)
  );
}

export async function getExports(corpusId) {
  return axios
    .get("list-exports", { params: { corpus_id: corpusId } })
    .then((response) => response.data.contents);
}

export async function downloadExports(corpusId) {
  const response = await axios.get("download-exports", {
    params: { corpus_id: corpusId },
    responseType: "blob",
  });
  return response.data;
}

export async function downloadExportFile(corpusId, path) {
  const response = await axios.get("download-exports", {
    params: {
      corpus_id: corpusId,
      file: path,
      zip: false,
    },
    responseType: "blob",
  });
  return response.data;
}

export async function downloadSourceText(corpusId, fileName) {
  const response = await axios.get("download-source-text", {
    params: { corpus_id: corpusId, file: fileName },
  });
  return response.data;
}

export async function downloadSource(corpusId, fileName) {
  return axios
    .get("download-sources", {
      params: { corpus_id: corpusId, file: fileName, zip: false },
    })
    .then((response) => response.data);
}

export async function removeCorpus(corpusId) {
  return axios.delete("remove-corpus", { params: { corpus_id: corpusId } });
}

export const isStatusStarted = (status) => STATUSES[status]?.started;
export const isStatusRunning = (status) => STATUSES[status]?.running;
export const isStatusDone = (status) => status == "done_syncing";
export const statusMessage = (status) => STATUSES[status]?.message;

// prettier-ignore
const STATUSES = {
  none:             { started: false, running: false, message: "" },
  syncing_corpus:   { started:  true, running:  true, message: "syncing_corpus" },
  waiting:          { started:  true, running:  true, message: "waiting" },
  annotating:       { started:  true, running:  true, message: "annotating" },
  done_annotating:  { started:  true, running:  true, message: "done_annotating" },
  syncing_results:  { started:  true, running:  true, message: "syncing_results" },
  done_syncing:     { started:  true, running: false, message: "done_syncing" },
  error:            { started:  true, running: false, message: "error" },
  aborted:          { started:  true, running: false, message: "aborted" },
};
