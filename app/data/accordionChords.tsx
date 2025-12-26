export interface ChordsChallenge {
  difficulty: number;
  description: string;
  progressions: ChordProgression[];
}

export interface ChordProgression {
  name:string;
  chords: string[];
  description: string;
  tags: string[];
}

export const ACCORDION_CHORDS: ChordsChallenge[] = [
  {
    "difficulty": 1,
    "description": "Simple diatonic harmony in Cor, focusing on the primary chords (I, IV, V) and the relative minor (vi). This is the foundation of most folk and pop music, relying on easily accessible buttons.",
    "progressions": [
      {
        "name": "The Four Chords",
        "chords": [
          "C",
          "G",
          "A min",
          "F"
        ],
        "description": "The most common progression, easy to play and instantly recognizable.",
        "tags": [
          "Folk",
          "Simple Pop",
          "Ballad"
        ]
      },
      {
        "name": "Simple Rock/Pop",
        "chords": [
          "C",
          "G",
          "A min",
          "E min"
        ],
        "description": "A very stable progression that cycles through roots C-G-A-E.",
        "tags": [
          "Rock and Roll",
          "Pop-Rock"
        ]
      },
      {
        "name": "Waltz Pattern (I-IV-V)",
        "chords": [
          "G",
          "C",
          "D",
          "G"
        ],
        "description": "Perfectly suits a 3/4 time signature, common in German/Alpine folk.",
        "tags": [
          "Polka",
          "Waltz",
          "Alpine Folk"
        ]
      },
      {
        "name": "Minor-Key Lament",
        "chords": [
          "A min",
          "D min",
          "A min",
          "E"
        ],
        "description": "Uses theor V (E) to create a strong, classical resolution back to the tonic minor.",
        "tags": [
          "Classical",
          "Minor Ballad",
          "Lament"
        ]
      },
      {
        "name": "March/Shanty",
        "chords": [
          "F",
          "C",
          "Bb",
          "F"
        ],
        "description": "Strong subdominant movement (IV to I) suitable for marches and sea shanties.",
        "tags": [
          "March",
          "Sea Shanty"
        ]
      }
    ]
  },
  {
    "difficulty": 2,
    "description": "Introduces Dominant 7th chords (V7) for tension and release, and the simple 2-5-1 in aor key. The player begins to use the dedicated 7th chord row.",
    "progressions": [
      {
        "name": "Basic Blues in F",
        "chords": [
          "F",
          "Bb",
          "C 7",
          "F"
        ],
        "description": "The fundamental I-IV-V7 structure of a 12-bar blues simplified to four chords.",
        "tags": [
          "Blues",
          "Rhythm and Blues",
          "Early Rock"
        ]
      },
      {
        "name": "V-I Resolution",
        "chords": [
          "D min",
          "G 7",
          "C",
          "C"
        ],
        "description": "The classic ii-V-I cadence, the cornerstone of Jazz and popular harmony.",
        "tags": [
          "Jazz Standards",
          "Bossa Nova",
          "Swing"
        ]
      },
      {
        "name": "Musette Valse",
        "chords": [
          "G min",
          "C 7",
          "F",
          "Bb"
        ],
        "description": "A minor ii-V-I variation that resolves to aor key, typical of French Musette.",
        "tags": [
          "French Musette",
          "Continental Folk"
        ]
      },
      {
        "name": "Tango Feel",
        "chords": [
          "A min",
          "E 7",
          "A min",
          "D min"
        ],
        "description": "The strong V7-i movement that provides the dramatic, driving tension needed for tango.",
        "tags": [
          "Tango",
          "Latin",
          "Milonga"
        ]
      },
      {
        "name": "Secondary Dominant (V/vi)",
        "chords": [
          "C",
          "A 7",
          "D min",
          "G 7"
        ],
        "description": "The A7 (V/vi) briefly pulls the ear toward A minor before the G7 brings it back to C.",
        "tags": [
          "Popular Songwriting",
          "Classic Pop"
        ]
      }
    ]
  },
  {
    "difficulty": 3,
    "description": "Incorporates basic modal interchange and secondary dominants that require quick, precise movement across theor, minor, and 7th chord rows, including the use of the diminished button.",
    "progressions": [
      {
        "name": "Tonicization of V",
        "chords": [
          "C",
          "D 7",
          "G",
          "C"
        ],
        "description": "The D7 (V of G) strongly tonicizes the V chord before returning to the tonic.",
        "tags": [
          "Standard Jazz",
          "Show Tunes"
        ]
      },
      {
        "name": "Minor 2-5-1 (Simplified)",
        "chords": [
          "F Dim",
          "Bb 7",
          "Eb",
          "Eb"
        ],
        "description": "Uses the diminished chord button (a common substitution for the half-diminished ii chord) in a minor key progression.",
        "tags": [
          "Jazz Ballad",
          "Minor Key Jazz"
        ]
      },
      {
        "name": "Chromatic Bass Walk",
        "chords": [
          "C",
          "A min",
          "Ab",
          "G 7"
        ],
        "description": "Utilizes the borrowed bVI chord (Ab) for a smooth chromatic descending bass line (C-A-Ab-G).",
        "tags": [
          "Soul",
          "Advanced Pop"
        ]
      },
      {
        "name": "Cannonball's Changes",
        "chords": [
          "C",
          "E 7",
          "A min",
          "D min"
        ],
        "description": "A progression popularized by 'Autumn Leaves,' featuring I-III7-vi-ii.",
        "tags": [
          "Jazz Standards",
          "Cool Jazz"
        ]
      },
      {
        "name": "Minor Key 2-5-1",
        "chords": [
          "B Dim",
          "E 7",
          "A min",
          "D min"
        ],
        "description": "The standard minor key ii-V-i (B dim is the ii° of A minor) requiring accurate diminished button use.",
        "tags": [
          "Bossa Nova",
          "Flamenco"
        ]
      }
    ]
  },
  {
    "difficulty": 4,
    "description": "Focuses on Modulating 2-5-1 sequences, frequent use of the Diminished 7th button, and chromaticism. Requires the player to jump keys frequently and utilize the diminished button as a passing chord.",
    "progressions": [
      {
        "name": "Descending 7ths (Chromatic)",
        "chords": [
          "C",
          "B 7",
          "Bb 7",
          "A 7"
        ],
        "description": "A dramatic, sequential descent of dominant 7th chords often used in jazz/show tunes.",
        "tags": [
          "Gypsy Jazz",
          "Show Tunes",
          "Vaudeville"
        ]
      },
      {
        "name": "Diminished as V/vi",
        "chords": [
          "C",
          "G Dim",
          "A min",
          "D 7"
        ],
        "description": "Uses the fully diminished chord as a substitute for the E7 (V/vi) for a darker sound.",
        "tags": [
          "Tango Nuevo",
          "Melodrama"
        ]
      },
      {
        "name": "Modulating Sequence",
        "chords": [
          "C",
          "F",
          "Bb",
          "Eb"
        ],
        "description": "Sequencing by perfect fourths, moving rapidly through four different keys.",
        "tags": [
          "Jazz Fusion",
          "Film Score",
          "Jazz Waltz"
        ]
      },
      {
        "name": "Extended 2-5-1",
        "chords": [
          "D min",
          "Db Dim",
          "C",
          "F"
        ],
        "description": "Uses the Db Diminished chord as a tritone substitution for the G7 to resolve to C.",
        "tags": [
          "Bebop",
          "Modern Jazz"
        ]
      },
      {
        "name": "Harmonic Minor Feel",
        "chords": [
          "A min",
          "D min",
          "G",
          "C"
        ],
        "description": "A minor progression where the Gor chord is used for a temporary 'major' lift before resolution.",
        "tags": [
          "Gypsy Jazz",
          "East European Folk"
        ]
      }
    ]
  },
  {
    "difficulty": 5,
    "description": "Advanced jazz harmony requiring high-speed button navigation, including Tritone Substitution (subV7 to I) and non-functional chromatic movement. The player must fluidly switch between widely spaced buttons.",
    "progressions": [
      {
        "name": "Tritone Sub (2-subV-I)",
        "chords": [
          "D min",
          "Db 7",
          "C",
          "C"
        ],
        "description": "The Db7 (substitute V) is a half-step away from the tonic, creating a smooth but tense resolution.",
        "tags": [
          "Modern Jazz",
          "Post-Bop"
        ]
      },
      {
        "name": "Backdoor Progression",
        "chords": [
          "G min",
          "C 7",
          "F",
          "Bb 7"
        ],
        "description": "A very common Jazz vamp that delays resolution and maintains momentum.",
        "tags": [
          "Fusion",
          "Modal Jazz"
        ]
      },
      {
        "name": "Chromatic Mediant Skip",
        "chords": [
          "C",
          "A",
          "F",
          "Db"
        ],
        "description": "Jumps between keys whose roots areor thirds apart, creating a lush, unexpected sound.",
        "tags": [
          "Cinematic Score",
          "Romantic Era",
          "Progressive Rock"
        ]
      },
      {
        "name": "Diminished Chain",
        "chords": [
          "G Dim",
          "Bb Dim",
          "C Dim",
          "E Dim"
        ],
        "description": "A sequence of diminished chords, often used for fast, tension-building transitions.",
        "tags": [
          "Transition/Bridge",
          "Dissonant Jazz"
        ]
      },
      {
        "name": "Vamp with Tonal Ambiguity",
        "chords": [
          "E min",
          "A 7",
          "D",
          "B 7"
        ],
        "description": "A loop that avoids resting on a clear tonic, keeping the harmony open and evolving.",
        "tags": [
          "Experimental",
          "Impressionism"
        ]
      }
    ]
  }
]
