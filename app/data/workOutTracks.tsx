
export interface WorkOutTrack {
  difficulty: number;
  name:string;
  chords: string[];
  description: string;
  tags: string[];
}


export const WORKOUT_TRAKCS: WorkOutTrack[] = [

    {
        "difficulty": 1,
        "name": "The Four Chords",
        "chords": [
          "C",
          "G",
          "Am",
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
        "difficulty": 1,
        "name": "Simple Rock/Pop",
        "chords": [
          "C",
          "G",
          "Am",
          "Em"
        ],
        "description": "A very stable progression that cycles through roots C-G-A-E.",
        "tags": [
          "Rock and Roll",
          "Pop-Rock"
        ]
      },
    {
        "difficulty": 1,
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
        "difficulty": 1,
        "name": "Minor-Key Lament",
        "chords": [
          "Am",
          "Dm",
          "Am",
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
        "difficulty": 1,
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
      },
        {
            "difficulty": 2,
        "name": "Basic Blues in F",
        "chords": [
          "F",
          "Bb",
          "C7",
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
        "difficulty": 2,
        "name": "V-I Resolution",
        "chords": [
          "Dm",
          "G7",
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
        "difficulty": 2,
        "name": "Musette Valse",
        "chords": [
          "Gm",
          "C7",
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
        "difficulty": 2,
        "name": "Tango Feel",
        "chords": [
          "Am",
          "E7",
          "Am",
          "Dm"
        ],
        "description": "The strong V7-i movement that provides the dramatic, driving tension needed for tango.",
        "tags": [
          "Tango",
          "Latin",
          "Milonga"
        ]
      },
    {
        "difficulty": 2,
        "name": "Secondary Dominant (V/vi)",
        "chords": [
          "C",
          "A7",
          "Dm",
          "G7"
        ],
        "description": "The A7 (V/vi) briefly pulls the ear toward A minor before the G7 brings it back to C.",
        "tags": [
          "Popular Songwriting",
          "Classic Pop"]
 },
    {
        "difficulty": 3,
        "name": "Tonicization of V",
        "chords": [
          "C",
          "D7",
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
        "difficulty": 3,
        "name": "Minor 2-5-1 (Simplified)",
        "chords": [
          "Fdim",
          "Bb7",
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
        "difficulty": 3,
        "name": "Chromatic Bass Walk",
        "chords": [
          "C",
          "Am",
          "Ab",
          "G7"
        ],
        "description": "Utilizes the borrowed bVI chord (Ab) for a smooth chromatic descending bass line (C-A-Ab-G).",
        "tags": [
          "Soul",
          "Advanced Pop"
        ]
      },
    {
        "difficulty": 3,
        "name": "Cannonball's Changes",
        "chords": [
          "C",
          "E7",
          "Am",
          "Dm"
        ],
        "description": "A progression popularized by 'Autumn Leaves,' featuring I-III7-vi-ii.",
        "tags": [
          "Jazz Standards",
          "Cool Jazz"
        ]
      },
    {
        "difficulty": 3,
        "name": "Minor Key 2-5-1",
        "chords": [
          "Bdim",
          "E7",
          "Am",
          "Dm"
        ],
        "description": "The standard minor key ii-V-i (B dim is the ii° of A minor) requiring accurate diminished button use.",
        "tags": [
          "Bossa Nova",
          "Flamenco"
        ]
      }
,
{
    "difficulty": 4,
        "name": "Descending 7ths (Chromatic)",
        "chords": [
          "C",
          "B7",
          "Bb7",
          "A7"
        ],
        "description": "A dramatic, sequential descent of dominant 7th chords often used in jazz/show tunes.",
        "tags": [
          "Gypsy Jazz",
          "Show Tunes",
          "Vaudeville"
        ]
      },
    {
        "difficulty": 4,
        "name": "Diminished as V/vi",
        "chords": [
          "C",
          "Gdim",
          "Am",
          "D7"
        ],
        "description": "Uses the fully diminished chord as a substitute for the E7 (V/vi) for a darker sound.",
        "tags": [
          "Tango Nuevo",
          "Melodrama"
        ]
      },
    {
        "difficulty": 4,
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
        "difficulty": 4,
        "name": "Extended 2-5-1",
        "chords": [
          "Dm",
          "Dbdim",
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
        "difficulty": 4,
        "name": "Harmonic Minor Feel",
        "chords": [
          "Am",
          "Dm",
          "G",
          "C"
        ],
        "description": "A minor progression where the Gor chord is used for a temporary 'major' lift before resolution.",
        "tags": [
          "Gypsy Jazz",
          "East European Folk"
        ]
      },

    {
        "difficulty": 5,
        "name": "Tritone Sub (2-subV-I)",
        "chords": [
          "Dm",
          "Db7",
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
        "difficulty": 5,
        "name": "Backdoor Progression",
        "chords": [
          "Gm",
          "C7",
          "F",
          "Bb7"
        ],
        "description": "A very common Jazz vamp that delays resolution and maintains momentum.",
        "tags": [
          "Fusion",
          "Modal Jazz"
        ]
      },
    {
        "difficulty": 5,
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
        "difficulty": 5,
        "name": "Diminished Chain",
        "chords": [
          "Gdim",
          "Bbdim",
          "Cdim",
          "Edim"
        ],
        "description": "A sequence of diminished chords, often used for fast, tension-building transitions.",
        "tags": [
          "Transition/Bridge",
          "Dissonant Jazz"
        ]
      },
    {
        "difficulty": 5,
        "name": "Vamp with Tonal Ambiguity",
        "chords": [
          "Em",
          "A7",
          "D",
          "B7"
        ],
        "description": "A loop that avoids resting on a clear tonic, keeping the harmony open and evolving.",
        "tags": [
          "Experimental",
          "Impressionism"
        ]
      }
    ]