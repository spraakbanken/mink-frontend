import { computedAsync } from "@vueuse/core";
import { useApi } from "./useApi";
import { objsToDict } from "@/util";

/** Load and extract API info data */
export function useApiInfo() {
  const api = useApi();

  return computedAsync(async () => {
    const info = await api.getInfo();

    const limits = objsToDict(info.file_size_limits.data, "name", "value");

    const recommended = {
      corpus: objsToDict(
        info.resource_info.corpus.recommended_file_size.data,
        "name",
        "value",
      ),
    };

    return {
      max: {
        file: limits.max_file_length,
        upload: limits.max_content_length,
        resource: limits.max_resource_length,
      },
      corpusRecommended: [
        recommended.corpus.recommended_min_file_length,
        recommended.corpus.recommended_max_file_length,
      ],
    };
  });
}
