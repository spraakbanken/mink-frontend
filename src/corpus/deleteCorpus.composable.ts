import { useAuth } from "@/auth/auth.composable";
import useMinkBackend from "@/api/backend.composable";
import useMessenger from "@/message/messenger.composable";
import useResources from "@/library/resources.composable";

export default function useDeleteCorpus() {
  const { refreshJwt } = useAuth();
  const mink = useMinkBackend();
  const { refreshResources } = useResources();
  const { alertError } = useMessenger();

  /**
   * Delete a corpus in backend.
   */
  async function deleteCorpus(corpusId: string): Promise<void> {
    // Delete corpus in the backend.
    await mink.deleteCorpus(corpusId).catch(alertError);
    // The backend will have updated the remote JWT, so refresh our copy.
    // The backend uses the corpus list within it when listing available corpora.
    await refreshJwt();
    await refreshResources();
  }

  return { deleteCorpus };
}
