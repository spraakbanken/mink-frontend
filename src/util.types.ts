export type SweEng = "swe" | "eng";
export type SvEn = "sv" | "en";

export type ByLang<T = string> = Record<SweEng, T>;
