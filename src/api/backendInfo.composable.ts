import { computed, readonly, ref } from "vue";
import api from "./api";
import type { InfoData } from "./api.types";
import { keyBy, objsToDict } from "@/util";

export type Info = {
  status_codes: Record<string, string>;
  importer_modules: Record<string, string>;
  file_size_limits: Record<
    InfoData["file_size_limits"]["data"][0]["name"],
    {
      description: string;
      value: number;
    }
  >;
  recommended_file_size: Record<
    InfoData["recommended_file_size"]["data"][0]["name"],
    {
      description: string;
      value: number;
    }
  >;
};

const info = ref<Info | undefined>();
api.getInfo().then((original: InfoData) => {
  const status_codes = objsToDict(
    original.status_codes.data,
    "name",
    "description",
  );
  const importer_modules = objsToDict(
    original.importer_modules.data,
    "file_extension",
    "importer",
  );
  const file_size_limits = keyBy(original.file_size_limits.data, "name");
  const recommended_file_size = keyBy(
    original.recommended_file_size.data,
    "name",
  );
  info.value = {
    status_codes,
    importer_modules,
    file_size_limits,
    recommended_file_size,
  };
});

/** Wraps API endpoints with Spin. */
export default function useMinkBackendInfo() {
  const hasInfo = computed(() => !!Object.keys(info).length);

  return {
    info: readonly(info),
    hasInfo,
  };
}
