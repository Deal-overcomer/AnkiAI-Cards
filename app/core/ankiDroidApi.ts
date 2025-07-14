import AnkiDroid from '@deal-overcomer/react-native-ankidroid';

const sample = async () => {
  await AnkiDroid.requestPermission();
  // Name of deck which will be created in AnkiDroid
  const deckName = 'English';
  // Name of model which will be created in AnkiDroid (can be any string)
  const modelName = 'English  Img+cloze+native_word';
  // Used to save a reference to this deck in the SharedPreferences (can be any string)
  const dbDeckReference = 'com.your.app.decks';
  // Used to save a reference to this model in the SharedPreferences (can be any string)
  const dbModelReference = 'com.your.app.models';
  // Optional space separated list of tags to add to every note
  const tags = ['english', 'ankiDroidApi', 'react-native'];
  // List of field names that will be used in AnkiDroid model
  const modelFields = [
    'Keyword',
    'IMG',
    'Definition',
    'Example',
    'Native_word',
  ];
  // List of card names that will be used in AnkiDroid (one for each direction of learning)
  const cardNames = ['Cloze 1'];
  // CSS to share between all the cards (optional).
  const css = `
    .card {
    font-family: arial;
    line-height: 1.75em;
    font-size: 18px;
    text-align: center;
    color: black;
    background-color: #f3f3f3;
    }
    
    .Deck {
    position: absolute; top: 7px; left: 0px; width: 100%;
    }
    #Deck {
    font-size: 8pt; vertical-align: top; line-height: 10pt;
    }
    
    .cloze {
    font-weight: bold;
    color: blue;
    }
    
    #typeans {
    padding-top: 0.5em;
    text-align: center;
    max-width: 300px;
    }
    input#typeans {
    border-radius: 9px
    }
    IMG {
    border-radius: 19px;
    max-height: 248px;
    }
    div span {
    max-width: 900px;
    display: inline-block;
    text-align: center;
    }
    .Example {
    font-style: italic;
    color: gray;
    font-size: 16px;
    }
    
    /* solarize http://ethanschoonover.com/solarized
    * http://ospalh.github.io/anki-addons/Scalar.html
    * http://ospalh.github.io/anki-addons/Compare%20to%20kana.html
    */
    
    .typeBad {
    color: #dc322f;
    background-color: #ffadab;
    font-weight:bold;
    font-size: 23px;
    }
    .typeMissed, .typePass {
    color: #217dbe;
    font-weight:bold;
    font-size: 23px;
    }
    .typeGood {
    background-color: #a4dab2;
    color: #158d35;
    font-weight:bold;
    font-size: 23px;
    }
    `;
  // Template for the question of each card
  const questionFmt1 = `
    <script>document.getElementById('Deck').innerHTML="{{Deck}}".replace("::"," &minus; ");</script>


    <div class=Definition><span>{{cloze:Definition}}</span></div>
    <div class="IMG">{{IMG}}</div>
    <div class=Example><span>{{cloze:Example}}</span></div>
    
    {{type:Keyword}}
    `;
  const questionFormat = [questionFmt1];
  // Template for the answer (this example is identical for both sides)
  const answerFmt1 = `
    <script>document.getElementById('Deck').innerHTML="{{Deck}}".replace("::"," &minus; ");</script>


    <div class="IMG">{{IMG}}</div>
    <div class=Definition><span>{{cloze:Definition}}</span></div>
    <div class=Example><span>{{cloze:Example}}</span></div>

    {{type:Keyword}}

    <!hr id=answer>

    <div class=Russian><span>{{Native_word}}</span></div>
    {{tts en_US:Keyword}}
    {{tts en_US:cloze:Definition}}
    {{tts en_US:cloze:Example}}
    `;
  const answerFormat = [answerFmt1];

  //////////////////
  // ADDING NOTES //
  //////////////////

  const deckProperties = {
    name: deckName,
    dbReference: dbDeckReference,
  };
  const modelProperties = {
    name: modelName,
    dbReference: dbModelReference,
    fields: modelFields,
    tags,
    cardNames,
    questionFormat,
    answerFormat,
    css,
  };

  `
    'Keyword',
    'IMG',
    'Definition',
    'Example',
    'Native_word'
    `;

  const valueFields = [
    'map',
    '',
    'shows your point{{c1}}',
    'pass me ur {{c1::map}}',
    'карта',
  ];

  const settings = {
    modelId: undefined,
    modelProperties: modelProperties,
    deckId: undefined,
    deckProperties: deckProperties,
  };

  const myAnkiDeck = new AnkiDroid(settings);

  myAnkiDeck.addNote(valueFields, modelFields);
  // returns a promise that returns the added note ID
};
