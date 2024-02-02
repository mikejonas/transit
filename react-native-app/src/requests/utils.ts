interface MatchedSubstring {
  length: number;
  offset: number;
}

interface Term {
  offset: number;
  value: string;
}

interface StructuredFormatting {
  main_text: string;
  main_text_matched_substrings: MatchedSubstring[]; // Adjusted to directly use MatchedSubstring[]
  secondary_text: string;
}

export interface AutocompletePrediction {
  description: string;
  matched_substrings: MatchedSubstring[];
  place_id: string;
  reference: string;
  structured_formatting: StructuredFormatting;
  terms: Term[];
  types: string[]; // Array of types, e.g., ["locality", "political", "geocode"]
}

export interface LocationAutocompleteResponse {
  data: {
    predictions: AutocompletePrediction[];
  };
}
