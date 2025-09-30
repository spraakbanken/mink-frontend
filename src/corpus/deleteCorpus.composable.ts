import { useAuth } from "@/auth/auth.composable";
import useMessenger from "@/message/messenger.composable";
import { useResourceStore } from "@/store/resource.store";
import useSpin from "@/spin/spin.composable";
import api from "@/api/api";

export default function useDeleteCorpus() {
  const { getJwt } = useAuth();
  const { spin } = useSpin();
  const { loadResourceIds } = useResourceStore();
  const { alertError } = useMessenger();

  async function doDeleteCorpus(corpusId: string): Promise<void> {
    // Delete corpus in the backend.
    await api.removeCorpus(corpusId);
    // The backend will have updated the remote JWT, so refresh our copy.
    // The backend uses the corpus list within it when listing available corpora.
    await getJwt(true);
    await loadResourceIds();
  }

  /**
   * Delete a corpus in backend and refresh resources.
   */
  async function deleteCorpus(corpusId: string) {
    // Wrap whole delete flow in spin for visual feedback.
    return spin(
      doDeleteCorpus(corpusId).catch(alertError),
      `corpus/${corpusId}`,
    );
  }

  return { deleteCorpus };
}
