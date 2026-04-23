export const FILE_FORMATS = [
  "txt",
  "xml",
  "odt",
  "docx",
  "pdf",
  "conllu",
  "mp3",
  "ogg",
  "wav",
] as const;

export type FileFormat = (typeof FILE_FORMATS)[number];

/** Whether file format is human-readable (i.e. can be displayed in the UI) */
export function isReadable(format?: string): boolean {
  return ["txt", "xml", "conllu"].includes(format || "");
}

export const CORPUS_SOURCE_FORMATS = [
  "txt",
  "xml",
  "odt",
  "docx",
  "pdf",
  "conllu",
  "mp3",
  "ogg",
  "wav",
] as const;

export const SOURCE_FORMATS = {
  corpus: CORPUS_SOURCE_FORMATS,
  metadata: [],
} as const;
