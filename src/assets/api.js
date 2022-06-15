import Axios from "axios";

const axios = Axios.create({
  baseURL: "https://ws.spraakbanken.gu.se/ws/min-sb/",
});

export function initialize(jwt) {
  axios.defaults.headers["Authorization"] = `Bearer ${jwt}`;
}

export function listCorpora() {
  return axios.get("list-corpora").then((response) => response.data.corpora);
}

export function getCorpus(corpusId) {
  return axios
    .get("list-sources", { params: { corpus_id: corpusId } })
    .then((response) => response.data.contents);
}

export async function createCorpus(corpusId) {
  await axios.post("create-corpus", null, {
    params: { corpus_id: corpusId },
  });
}

export function putSources(corpusId, files) {
  const formData = new FormData();
  [...files].forEach((file) => formData.append("files[]", file));
  return axios.put("upload-sources", formData, {
    params: { corpus_id: corpusId },
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
  return axios
    .get("download-exports", {
      params: { corpus_id: corpusId },
      responseType: "blob",
    })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${corpusId}.zip`);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
    });
}

export async function downloadExportFileXML(corpusId, fileName) {
  return axios
    .get("download-exports", {
      params: {
        corpus_id: corpusId,
        file: "/Min Språkbank/" + corpusId + "/export/xml_pretty/" + fileName,
        zip: false,
      },
      responseType: "blob",
    })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${fileName.replace("_export", "")}`);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
    });
}

export async function downloadExportFileTxt(corpusId, fileName) {
  return axios
    .get("download-source-text", {
      params: { corpus_id: corpusId, file: fileName },
      responseType: "blob",
    })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${fileName}`);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
    });
}

export async function getContentViewX(corpusId, fileName) {
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
export const isStatusDone = (status) => status == "done";
export const statusMessage = (status) => STATUSES[status]?.message;

// prettier-ignore
const STATUSES = {
  none:             { started: false, running: false, message: "" },
  syncing_corpus:   { started:  true, running:  true, message: "syncing_corpus" },
  waiting:          { started:  true, running:  true, message: "waiting" },
  annotating:       { started:  true, running:  true, message: "annotating" },
  done_annotating:  { started:  true, running:  true, message: "done_annotating" },
  syncing_results:  { started:  true, running:  true, message: "syncing_results" },
  done:             { started:  true, running: false, message: "done" },
  error:            { started:  true, running: false, message: "error" },
  aborted:          { started:  true, running: false, message: "aborted" },
};
