import { useAuth } from "@/auth/auth.composable";
import useMinkBackend from "@/api/backend.composable";
import useMessenger from "@/message/messenger.composable";
import useCorpora from "@/library/corpora.composable";

export default function useDeleteCorpus() {
  const { refreshJwt } = useAuth();
  const mink = useMinkBackend();
  const { refreshCorpora } = useCorpora();
  const { alertError } = useMessenger();

  /**
   * Delete a corpus in backend.
   *
   * @param corpusId_ Needed if no id was set when calling `useCorpus`.
   */
  async function deleteCorpus(corpusId: string): Promise<void> {
    if (!corpusId) {
      throw new RangeError("Corpus ID missing");
    }

    // Delete corpus in the backend.
    await mink.deleteCorpus(corpusId).catch(alertError);
    // The backend will have updated the remote JWT, so refresh our copy.
    // The backend uses the corpus list within it when listing available corpora.
    await refreshJwt();
    await refreshCorpora();
  }

  return { deleteCorpus };
}
