import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { api } from "@/assets/api";
import useSpin from "@/assets/spin";

export default function useCorpora() {
  const store = useStore();
  const { t } = useI18n();
  const { spin } = useSpin();

  async function loadCorpora() {
    return spin(api.listCorpora(), t("corpus.list.loading"), "corpora").then(
      (corporaFetched) => store.commit("setCorpora", corporaFetched)
    );
  }

  return {
    loadCorpora,
  };
}
