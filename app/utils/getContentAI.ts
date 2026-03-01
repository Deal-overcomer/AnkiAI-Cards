const getContentAI = (prompt: string, settings: { language: string; levelOfLanguage: string }) => `
    Generate me a JSON object for the word "${prompt}".
    The JSON should follow this interface:
    {
      word: string;
      posData: [
        {
          partOfSpeech: string;
          definition: string;
          definitionCloze: string;
          examples: string[];
          examplesCloze: string[];
        },
      ];
    };
    
    Return ONLY the JSON object.
    Reponse in ${settings.language} language, use only ${settings.levelOfLanguage} words. 
    Make many parts of speech, in order: nouns, verbs, adjectives, adverbs, conjunctions, 
    prepositions, interjections, pronouns, determiners, etc. You can use any tenses.
    Don't make double POS, make 'noun-soft_thing, noun-wild_animal, verb-lift_hands', etc.
    Make 3 examples.

    Make the definitionCloze and examplesCloze by removing the word from the definition and examples,
    replacing it with '{{c1::word}}' and pay attention to the correct form of the word,
    also you can just add {{c1::}} in the end if sentence doesn't have the word.
    Always enter two double dotes and 'c1::' for cloze deletions.
    For example: 
    {
      word: "run";
      posData: [
        {
          partOfSpeech: verb-move_fast;
          definition: "To move swiftly on foot.";
          definitionCloze: "To move swiftly on foot.{{c1::}}";
          examples: [
            "I like to run in the park.",
            "She runs very fast.",
            "Why are you running away?"
          ];
          examplesCloze: [
            "I like to {{c1::run}} in the park.",
            "She {{c1::runs}} very fast.",
            "Why are you {{c1::running}} away?"
          ];
        },
      ];
    };
`;

export default getContentAI;
