import type { AxiosError, AxiosProgressEvent } from "axios";
import type { ByLang, RequiredKeys, SweEng } from "@/util.types";

/** Properties common to most backend responses */
export type MinkResponse<
  T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
  status: "success" | "error";
  return_code: string;
  message: string;
};

/** Data in the info response */
export type InfoData = {
  status_codes: InfoDataSection<{
    name: JobState;
    description: string;
  }>;
  file_size_limits: InfoDataSection<{
    name: "max_content_length" | "max_file_length" | "max_resource_length";
    description: string;
    value: number;
  }>;
  resource_info: {
    corpus: {
      description: string;
      importer_modules: InfoDataSection<{
        file_extension: `.${string}`;
        importer: string;
      }>;
      recommended_file_size: InfoDataSection<{
        name: "recommended_max_file_length" | "recommended_min_file_length";
        description: string;
        value: number;
      }>;
    };
    metadata: {
      description: string;
    };
  };
};

export type BackendError = RequiredKeys<AxiosError<MinkResponse>, "response">;

/** A structure for a section in the backend info response */
type InfoDataSection<T> = {
  info: string;
  data: T[];
};

/** Lists available exports */
export type SparvExportsData = {
  /** List of available export formats */
  exports: ExportType[];
  /** ISO code of the language chosen for the export listing */
  language: "swe";
};

/** Data in the sparv-exports response */
export type ExportType = {
  description: string;
  export: string;
  export_files: string[];
};

/** Data in the sparv-schema response */
export type SparvSchemaData = {
  sparv_schema: object;
};

/** Data in the list-corpora response */
export type ResourceListData = {
  resources: string[];
};

/** Data in the create-<resource type> response */
export type CreateResourceData = {
  resource_id: string;
};

/** Data in the `resource/status/list` response */
export type ResourceStatusListData = {
  resources: ResourceInfo[];
};

/** Data about a resource and its job status */
export type ResourceInfo<T extends ResourceType = ResourceType> = {
  owner: UserData;
  resource: ResourceData;
  job: JobInfo<T>;
  job_status: JobState;
};

/** Data about a Mink user */
export type UserData = {
  id: string;
  name: string;
  email: string;
  ui_language: SweEng;
};

/** Basic data about a resource */
export type ResourceData = {
  type: ResourceType;
  id: string;
  public_id: string;
  name: ByLang;
  source_files: FileMeta[];
};

export type ResourceType = "corpus" | "lexicon" | "metadata";

/** Job status for a resource */
export type JobInfo<T extends ResourceType> = {
  current_process: JobType<T> | null;
  duration: number;
  /** ISO 8601 date */
  ended: string | "";
  errors: string;
  output: string;
  /** Queue number, starting at 1 */
  priority: number | "";
  /** Percentage of job completion, if running */
  progress: `${number}%` | "";
  /** ISO 8601 date */
  started: string | "";
  status: JobStateMap<T>;
  warnings: string;
} & JobInfoExtra[T];

type JobInfoExtra = {
  corpus: {
    installed_korp: boolean;
    installed_strix: boolean;
  };
  lexicon: {
    installed_karps: boolean;
  };
  // Metadata has no extra job info, `object` means `{}`
  metadata: object;
};

export type JobStateMap<T extends ResourceType> = Record<JobType<T>, JobState>;

/** File metadata */
export type FileMeta = {
  /** ISO 8601 date (with timezone offset) of last modification */
  last_modified: string;
  /** Filename */
  name: string;
  /** File path, relative to some directory */
  path: string;
  /** File size (bytes) */
  size: number;
  /** MIME type e.g. "text/xml" */
  type: string;
};

/** Indicates a job type that the backend can do */
export type JobType<T extends ResourceType> = T extends "corpus"
  ? CorpusJobType
  : T extends "lexicon"
    ? LexiconJobType
    : never;

export type CorpusJobType = "sparv" | "korp" | "strix" | "sync2storage";
export type LexiconJobType = "karp_pipeline" | "karps";

/** The states a job can have */
export type JobState =
  | "none" // "Process does not exist"
  | "waiting" // "Waiting to be processed"
  | "running" // "Process is running"
  | "done" // "Process has finished"
  | "error" // "An error occurred in the process"
  | "aborted"; // "Process was aborted by the user"

/** Data in the list-exports response */
export type ListExportsData = {
  contents: FileMeta[];
};

/** Data in the admin-mode-status response */
export type AdminModeStatusData = {
  admin_mode_status: boolean;
};

export type ProgressHandler = (progressEvent: AxiosProgressEvent) => void;
