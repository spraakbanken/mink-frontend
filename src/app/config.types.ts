/** @file Types for the app config object */

/** App config object */
export type AppConfig = {
  types?: {
    // Keys correspond to `ResourceType`
    corpus?: {
      explore?: {
        korp?: true;
        strix?: true;
      };
    };
    metadata?: true;
  };
  tools?: {
    metadataEditor?: true;
  };
  sharing?: true;
};
