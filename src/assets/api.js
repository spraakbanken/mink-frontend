import Axios from "axios";
import base64 from "base-64";

const axios = Axios.create({
  baseURL: "https://ws.spraakbanken.gu.se/ws/min-sb/",
});

export function initialize(username, password) {
  const token = base64.encode(`${username}:${password}`);
  axios.defaults.headers["Authorization"] = `Basic ${token}`;
}

/**
 * Authenticate with backend, and store auth details if successful.
 * @param {string} username
 * @param {string} password
 * @returns A promise that resolves if authentication is successful, and rejects otherwise.
 */
export async function authenticate(username, password) {
  return await axios
    .post("init", null, {
      auth: { username, password },
    })
    .then(() => {
      initialize(username, password);
      return true;
    })
    // Interpret a 401 status as faulty name/pass.
    // Do not catch any other unexpected errors.
    .catch((error) => (error.response.status == 401 ? false : error));
}

export function listCorpora() {
  return axios.get("list-corpora").then((response) => response.data.corpora);
}

export function getCorpus(corpusId) {
  return axios
    .get("list-sources", { params: { corpus_id: corpusId } })
    .then((response) => response.data.contents);
}

export function createCorpus(corpusId) {
  return axios.post("create-corpus", null, {
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

export async function runSparv(corpusId) {
  const configFile = new File([configSample(corpusId)], "config.yaml", {
    type: "text/yaml",
  });
  const formData = new FormData();
  formData.append("files[]", configFile);
  await axios.put("upload-config", formData, {
    params: { corpus_id: corpusId },
  });
  return await axios.put("run-sparv", null, {
    params: { corpus_id: corpusId },
  });
}

const configSample = (corpusId) => `
metadata:
  id: ${corpusId}
export:
  annotations:
    - <sentence>:misc.id
    - <token>:saldo.baseform
    - <token>:hunpos.pos
    - <token>:sensaldo.sentiment_label
`;
