export const getPartOfSpeechFull = (pos: string): string => {
  const posLower = pos.toLowerCase();
  switch (posLower) {
    case "n":
      return "noun";
    case "v":
      return "verb";
    case "adj":
      return "adjective";
    case "adv":
      return "adverb";
    case "pron":
      return "pronoun";
    case "prep":
      return "preposition";
    case "conj":
      return "conjunction";
    case "interj":
      return "interjection";
    case "det":
      return "determiner";
    case "aux":
      return "auxiliary";
    default:
      return posLower;
  }
};
