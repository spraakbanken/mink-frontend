/** @file Types for the app config object */

/** App config object */
export type AppConfig = {
  auth: {
    /** URL to SB-Auth */
    apiUrl: string;
    /** URL to SB-Auth GUI */
    guiUrl?: string;
    /** SB-Auth logout URL */
    logoutUrl: string;
  };

  /** Base URL to Mink backend */
  backendUrl: string;

  /** Default data language */
  defaultLanguage?: string;

  /** Main instance URL */
  minkUrl?: string;

  /** Enable sharing features in UI */
  sharing?: true;

  /** Tools */
  tools?: {
    /** The Språkbanken metadata YAML editor */
    metadataEditor?: true;
  };

  /** Settings by resource type; omit an item to disable that type */
  types?: {
    corpus?: {
      /** Settings for corpus explore tools */
      explore?: {
        korp?: {
          /** URL to Korp frontend */
          url: string;
        };
        strix?: {
          /** URL to Strix frontend */
          url: string;
        };
      };
    };

    lexicon?: {
      karps?: {
        /** URL to Karp search frontend */
        url: string;
      };
    };

    metadata?: true;
  };

  ui?: {
    /**
     * Available UI languages, must be the same as those added to the Vue-I18n plugin.
     *
     * Vue-I18n only uses the 2-letter id, but the 3-letter key and the name are used in the UI.
     */
    languages?: {
      // Mnemonic: the keys "id" and "key" themselves have 2 and 3 letters respectively
      /** Language code to use with Vue-I18n, preferrably ISO 639-1 (two letters) */
      id: string;
      /** Language code to use in translatable strings, preferrably ISO 639-3 (three letters) */
      key: string;
      /** Human-readable name, in the language itself */
      name: string;
    }[];
  };
};
