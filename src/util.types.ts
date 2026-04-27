export type SweEng = "swe" | "eng";
export type SvEn = "sv" | "en";

export type ByLang<T = string> = Record<SweEng, T>;

/** Make the given keys required in the given type. */
export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;
