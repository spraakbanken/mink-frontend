import { useAuth } from "@/auth/auth.composable";
import { useResourceStore } from "@/store/resource.store";
import useSpin from "@/spin/spin.composable";
import api from "@/api/api";

export default function useDeleteCorpus() {
  const { refreshAuth } = useAuth();
  const { spin } = useSpin();
  const { loadResourceIds } = useResourceStore();

  async function doDeleteCorpus(corpusId: string): Promise<void> {
    // Delete corpus in the backend.
    await api.removeCorpus(corpusId);
    // The backend will have updated the remote JWT, so refresh our copy.
    // The backend uses the corpus list within it when listing available corpora.
    await refreshAuth();
    await loadResourceIds();
  }

  /**
   * Delete a corpus in backend and refresh resources.
   */
  async function deleteCorpus(corpusId: string) {
    // Wrap whole delete flow in spin for visual feedback.
    return spin(doDeleteCorpus(corpusId), `corpus/${corpusId}`);
  }

  return { deleteCorpus };
}
