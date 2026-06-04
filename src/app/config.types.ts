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
};
