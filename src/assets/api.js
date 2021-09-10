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

export async function listCorpora() {
  return await axios
    .get("list-corpora")
    .then((response) => response.data.corpora);
}

export async function getCorpus(corpusId) {
  return await axios
    .get("list-sources", { params: { corpus_id: corpusId } })
    .then((response) => response.data.contents);
}
