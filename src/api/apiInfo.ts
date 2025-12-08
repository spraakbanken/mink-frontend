import { keyBy } from "es-toolkit";
import api from "@/api/api";
import type { InfoData } from "@/api/api.types";
import { objsToDict } from "@/util";

/** Output format of `getInfo()` */
export type Info = {
  statusCodes: Record<string, string>;
  importerModules: Record<string, string>;
  fileSizeLimits: Record<
    InfoData["file_size_limits"]["data"][0]["name"],
    {
      description: string;
      value: number;
    }
  >;
  recommendedFileSize: Record<
    InfoData["recommended_file_size"]["data"][0]["name"],
    {
      description: string;
      value: number;
    }
  >;
};

/** Reformat the `/info` response */
export async function getInfo(): Promise<Info> {
  const original = await api.getInfo();

  const statusCodes = objsToDict(
    original.status_codes.data,
    "name",
    "description",
  );

  const importerModules = objsToDict(
    original.importer_modules.data,
    "file_extension",
    "importer",
  );

  const fileSizeLimits = keyBy(
    original.file_size_limits.data,
    (item) => item.name,
  );

  const recommendedFileSize = keyBy(
    original.recommended_file_size.data,
    (item) => item.name,
  );

  return {
    statusCodes,
    importerModules,
    fileSizeLimits,
    recommendedFileSize,
  };
}
