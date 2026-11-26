export interface WorkOutTrack {
  id: number;
  difficulty: number;
  name:string;
  chords: string[];
  description: string;
  tags: string[];
}

export const WORKOUT_TRAKCS: WorkOutTrack[] = [
    {
        "id": 1,
        "difficulty": 2,
        "name": "The Four Chords",
        "chords": [
          "C",
          "G",
          "Am",
          "F"
        ],
        "description": "The most common progression, instantly recognizable, with the full F chord adding a first barre-chord challenge on guitar.",
        "tags": [
          "Pop",
          "Folk",
          "Ballad",
          "Barre Chords"
        ]
      },
    {
        "id": 2,
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
          "Pop",
          "Rock",
          "Open Chords"
        ]
      },
    {
        "id": 3,
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
          "Folk",
          "Waltz",
          "Open Chords"
        ]
      },
    {
        "id": 4,
        "difficulty": 1,
        "name": "Minor-Key Lament",
        "chords": [
          "Am",
          "Dm",
          "Am",
          "E"
        ],
        "description": "Uses the V chord (E) to create a strong, classical resolution back to the tonic minor.",
        "tags": [
          "Classical",
          "Ballad",
          "Minor Key",
          "Open Chords"
        ]
      },
    {
        "id": 5,
        "difficulty": 3,
        "name": "March/Shanty",
        "chords": [
          "F",
          "C",
          "Bb",
          "F"
        ],
        "description": "Strong subdominant movement suitable for marches and sea shanties, with F and Bb making the guitar transitions barre-heavy.",
        "tags": [
          "Folk",
          "March",
          "Sea Shanty",
          "Barre Chords"
        ]
      },
        {
            "id": 6,
            "difficulty": 3,
        "name": "Basic Blues in F",
        "chords": [
          "F",
          "Bb",
          "C7",
          "F"
        ],
        "description": "The fundamental I-IV-V7 structure of a 12-bar blues simplified to four chords, but F and Bb require solid barre-chord movement on guitar.",
        "tags": [
          "Blues",
          "Rock",
          "Dominant 7ths",
          "Barre Chords"
        ]
      },
    {
        "id": 7,
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
          "Jazz",
          "Bossa Nova",
          "Dominant 7ths"
        ]
      },
    {
        "id": 8,
        "difficulty": 4,
        "name": "Musette Valse",
        "chords": [
          "Gm",
          "C7",
          "F",
          "Bb"
        ],
        "description": "A minor ii-V-I-style movement that resolves to a major key, with several barre-heavy flat-key shapes on guitar.",
        "tags": [
          "Jazz",
          "Waltz",
          "Barre Chords",
          "Dominant 7ths"
        ]
      },
    {
        "id": 9,
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
          "Minor Key",
          "Dominant 7ths"
        ]
      },
    {
        "id": 10,
        "difficulty": 2,
        "name": "Secondary Dominant (V/ii)",
        "chords": [
          "C",
          "A7",
          "Dm",
          "G7"
        ],
        "description": "The A7 (V/ii) briefly pulls the ear toward D minor before the G7 brings it back toward C.",
        "tags": [
          "Pop",
          "Secondary Dominants",
          "Dominant 7ths"
        ]
      },
    {
        "id": 11,
        "difficulty": 2,
        "name": "Tonicization of V",
        "chords": [
          "C",
          "D7",
          "G",
          "C"
        ],
        "description": "The D7 (V of G) strongly tonicizes the V chord before returning to the tonic.",
        "tags": [
          "Jazz",
          "Secondary Dominants",
          "Dominant 7ths"
        ]
      },
    {
        "id": 12,
        "difficulty": 5,
        "name": "Minor 2-5-1 (Simplified)",
        "chords": [
          "Fdim",
          "Bb7",
          "Eb",
          "Eb"
        ],
        "description": "Uses a diminished chord and flat-key dominant movement, requiring advanced compact shapes and careful position shifts on guitar.",
        "tags": [
          "Jazz",
          "Minor Key",
          "Diminished Chords",
          "Barre Chords"
        ]
      },
    {
        "id": 13,
        "difficulty": 4,
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
          "Pop",
          "Chromatic Movement",
          "Barre Chords"
        ]
      },
    {
        "id": 14,
        "difficulty": 2,
        "name": "Cannonball's Changes",
        "chords": [
          "C",
          "E7",
          "Am",
          "Dm"
        ],
        "description": "A progression popularized by 'Autumn Leaves,' featuring I-III7-vi-ii.",
        "tags": [
          "Jazz",
          "Pop",
          "Secondary Dominants",
          "Open Chords"
        ]
      },
    {
        "id": 15,
        "difficulty": 3,
        "name": "Minor Key 2-5-1",
        "chords": [
          "Bdim",
          "E7",
          "Am",
          "Dm"
        ],
        "description": "The standard minor key ii-V-i movement in A minor, with Bdim adding an intermediate diminished-chord shape.",
        "tags": [
          "Jazz",
          "Bossa Nova",
          "Minor Key",
          "Diminished Chords"
        ]
      },
    {
    "id": 16,
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
          "Jazz",
          "Chromatic Movement",
          "Dominant 7ths",
          "Barre Chords"
        ]
      },
    {
        "id": 17,
        "difficulty": 4,
        "name": "Diminished Passing to vi",
        "chords": [
          "C",
          "Gdim",
          "Am",
          "D7"
        ],
        "description": "Uses a diminished sonority as a dark chromatic passing chord between C and Am before D7 pushes the progression onward.",
        "tags": [
          "Jazz",
          "Tango",
          "Diminished Chords",
          "Chromatic Movement"
        ]
      },
    {
        "id": 18,
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
          "Jazz",
          "Film Score",
          "Modulation",
          "Barre Chords"
        ]
      },
    {
        "id": 19,
        "difficulty": 4,
        "name": "Chromatic Diminished Passing",
        "chords": [
          "Dm",
          "C#dim",
          "C",
          "F"
        ],
        "description": "Uses C#dim as a chromatic passing diminished chord between Dm and C, creating a tense half-step resolution on guitar.",
        "tags": [
          "Jazz",
          "Bebop",
          "Diminished Chords",
          "Chromatic Movement"
        ]
      },
    {
        "id": 20,
        "difficulty": 2,
        "name": "Minor-to-Relative Major Lift",
        "chords": [
          "Am",
          "Dm",
          "G",
          "C"
        ],
        "description": "A very playable minor progression that lifts into the relative major sound through G and C using open-position guitar shapes.",
        "tags": [
          "Folk",
          "Pop",
          "Minor Key",
          "Open Chords"
        ]
      },

    {
        "id": 21,
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
          "Jazz",
          "Tritone Substitution",
          "Dominant 7ths",
          "Barre Chords"
        ]
      },
    {
        "id": 22,
        "difficulty": 4,
        "name": "Jazz Cycle Vamp",
        "chords": [
          "Gm",
          "C7",
          "F",
          "Bb7"
        ],
        "description": "A jazz ii-V-I-IV7-style vamp in F that keeps momentum while requiring confident minor, dominant, and barre-chord transitions.",
        "tags": [
          "Jazz",
          "Fusion",
          "Dominant 7ths",
          "Barre Chords"
        ]
      },
    {
        "id": 23,
        "difficulty": 5,
        "name": "Chromatic Mediant Skip",
        "chords": [
          "C",
          "A",
          "F",
          "Db"
        ],
        "description": "Jumps between keys whose roots are thirds apart, creating a lush, unexpected sound with awkward guitar position shifts.",
        "tags": [
          "Film Score",
          "Progressive Rock",
          "Chromatic Movement",
          "Barre Chords"
        ]
      },
    {
        "id": 24,
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
          "Jazz",
          "Diminished Chords",
          "Chromatic Movement",
          "Transition/Bridge"
        ]
      },
    {
        "id": 25,
        "difficulty": 3,
        "name": "Vamp with Tonal Ambiguity",
        "chords": [
          "Em",
          "A7",
          "D",
          "B7"
        ],
        "description": "A playable dominant-cycle loop that avoids resting on a clear tonic while using mostly familiar guitar shapes.",
        "tags": [
          "Rock",
          "Folk",
          "Dominant 7ths",
          "Open Chords"
        ]
      },
          {
        "id": 26,
        "difficulty": 4,
        "name": "Sharp-Key Rock Lift",
        "chords": [
          "F#",
          "B",
          "E",
          "B",
          "B7"
        ],
        "description": "A bright sharp-key rock loop that moves through F# and B barre shapes before opening into E and B7.",
        "tags": [
          "Rock",
          "Pop",
          "Barre Chords"
        ]
      },
    {
        "id": 27,
        "difficulty": 4,
        "name": "Sharp Minor Fifths",
        "chords": [
          "Bm",
          "F#m",
          "C#m",
          "G#m"
        ],
        "description": "A descending-fifths minor drill through barre-heavy sharp-key shapes, useful for fretboard-position confidence.",
        "tags": [
          "Rock",
          "Minor Key",
          "Barre Chords",
          "Circle of Fifths"
        ]
      },
    {
        "id": 28,
        "difficulty": 5,
        "name": "Flat Minor Fourths",
        "chords": [
          "Cm",
          "Fm",
          "Bbm",
          "Ebm"
        ],
        "description": "A flat-key minor cycle that forces compact barre shapes and longer position shifts across the neck.",
        "tags": [
          "Jazz",
          "Minor Key",
          "Barre Chords",
          "Circle of Fifths"
        ]
      },
    {
        "id": 29,
        "difficulty": 4,
        "name": "Flat Dominant Cycle",
        "chords": [
          "F7",
          "Bb7",
          "Eb7",
          "Ab7"
        ],
        "description": "A dominant-seventh cycle through flat keys, common in blues and jazz turnarounds but demanding for guitar barre movement.",
        "tags": [
          "Blues",
          "Jazz",
          "Dominant 7ths",
          "Barre Chords"
        ]
      },
    {
        "id": 30,
        "difficulty": 4,
        "name": "Sharp Dominant Cycle",
        "chords": [
          "F#7",
          "B7",
          "E7",
          "A7"
        ],
        "description": "A dominant chain that mixes familiar open 7th shapes with a harder F#7 barre entry point.",
        "tags": [
          "Blues",
          "Rock",
          "Dominant 7ths",
          "Barre Chords"
        ]
      },
    {
        "id": 31,
        "difficulty": 5,
        "name": "Diminished Steps I",
        "chords": [
          "Cdim",
          "C#dim",
          "Ddim",
          "Ebdim"
        ],
        "description": "A technical chromatic diminished-shape drill for learning tight, movable tension chords on adjacent frets rather than a song-style progression.",
        "tags": [
          "Jazz",
          "Diminished Chords",
          "Chromatic Movement",
          "Transition/Bridge",
          "Technical Drill"
        ]
      },
    {
        "id": 32,
        "difficulty": 5,
        "name": "Diminished Steps II",
        "chords": [
          "Edim",
          "Fdim",
          "F#dim",
          "Gdim"
        ],
        "description": "A second technical chromatic diminished run, keeping the same compact shape family while shifting up the fretboard.",
        "tags": [
          "Jazz",
          "Diminished Chords",
          "Chromatic Movement",
          "Transition/Bridge",
          "Technical Drill"
        ]
      },
    {
        "id": 33,
        "difficulty": 5,
        "name": "Diminished Steps III",
        "chords": [
          "G#dim",
          "Adim",
          "Bbdim",
          "Bdim"
        ],
        "description": "A higher-position diminished workout focused on precise chromatic shifts and clean chord grip changes.",
        "tags": [
          "Jazz",
          "Diminished Chords",
          "Chromatic Movement",
          "Transition/Bridge",
          "Technical Drill"
        ]
      },
    {
        "id": 34,
        "difficulty": 5,
        "name": "Diminished 7 Cycle I",
        "chords": [
          "Cdim7",
          "Ebdim7",
          "F#dim7",
          "Adim7"
        ],
        "description": "A fully diminished seventh symmetry drill that repeats the same sonority every minor third, a common jazz tension device.",
        "tags": [
          "Jazz",
          "Diminished Chords",
          "Chromatic Movement",
          "Symmetrical Chords",
          "Technical Drill"
        ]
      },
    {
        "id": 35,
        "difficulty": 5,
        "name": "Diminished 7 Cycle II",
        "chords": [
          "C#dim7",
          "Edim7",
          "Gdim7",
          "Bbdim7"
        ],
        "description": "A second fully diminished seventh cycle for practicing the same grip across different root names and inversions.",
        "tags": [
          "Jazz",
          "Diminished Chords",
          "Chromatic Movement",
          "Symmetrical Chords",
          "Technical Drill"
        ]
      },
    {
        "id": 36,
        "difficulty": 5,
        "name": "Diminished 7 Cycle III",
        "chords": [
          "Ddim7",
          "Fdim7",
          "G#dim7",
          "Bdim7"
        ],
        "description": "A third diminished seventh cycle that completes the movable diminished vocabulary across all roots.",
        "tags": [
          "Jazz",
          "Diminished Chords",
          "Chromatic Movement",
          "Symmetrical Chords",
          "Technical Drill"
        ]
      },
    {
        "id": 37,
        "difficulty": 5,
        "name": "Augmented Symmetry I",
        "chords": [
          "Caug",
          "Eaug",
          "Abaug",
          "Caug"
        ],
        "description": "An augmented-triad cycle moving by major thirds, useful for cinematic tension and altered-dominant color.",
        "tags": [
          "Film Score",
          "Augmented Chords",
          "Chromatic Movement",
          "Symmetrical Chords",
          "Technical Drill"
        ]
      },
    {
        "id": 38,
        "difficulty": 5,
        "name": "Augmented Symmetry II",
        "chords": [
          "Dbaug",
          "Faug",
          "Aaug",
          "Dbaug"
        ],
        "description": "A second augmented cycle that keeps the same tense color while shifting to less common flat-key roots.",
        "tags": [
          "Film Score",
          "Augmented Chords",
          "Barre Chords",
          "Symmetrical Chords",
          "Technical Drill"
        ]
      },
    {
        "id": 39,
        "difficulty": 5,
        "name": "Augmented Symmetry III",
        "chords": [
          "Daug",
          "F#aug",
          "Bbaug",
          "Daug"
        ],
        "description": "An augmented major-third cycle mixing one open-friendly root with two harder movable guitar shapes.",
        "tags": [
          "Progressive Rock",
          "Augmented Chords",
          "Barre Chords",
          "Symmetrical Chords",
          "Technical Drill"
        ]
      },
    {
        "id": 40,
        "difficulty": 5,
        "name": "Augmented Symmetry IV",
        "chords": [
          "Ebaug",
          "Gaug",
          "Baug",
          "Ebaug"
        ],
        "description": "A final augmented cycle that completes the augmented set with rich, unstable voice-leading colors.",
        "tags": [
          "Jazz",
          "Augmented Chords",
          "Chromatic Movement",
          "Symmetrical Chords",
          "Technical Drill"
        ]
      },
    {
        "id": 41,
        "difficulty": 2,
        "name": "Open Sus2 Rock",
        "chords": [
          "Csus2",
          "Gsus2",
          "Dsus2",
          "Asus2"
        ],
        "description": "A bright suspended-chord workout built from open-position sus2 shapes that work well in modern acoustic rock.",
        "tags": [
          "Rock",
          "Pop",
          "Suspended Chords",
          "Open Chords"
        ]
      },
    {
        "id": 42,
        "difficulty": 2,
        "name": "Open Sus4 Rock",
        "chords": [
          "Csus4",
          "Gsus4",
          "Dsus4",
          "Asus4"
        ],
        "description": "A suspended-fourth progression focused on open chord grips and quick resolution-style hand movement.",
        "tags": [
          "Rock",
          "Pop",
          "Suspended Chords",
          "Open Chords"
        ]
      },
    {
        "id": 43,
        "difficulty": 3,
        "name": "E and B Sus Colors",
        "chords": [
          "Esus2",
          "Esus4",
          "Bsus2",
          "Bsus4"
        ],
        "description": "A suspended-color drill around E and B, adding moderate barre or partial-barre work for the B shapes.",
        "tags": [
          "Rock",
          "Suspended Chords",
          "Open Chords",
          "Barre Chords"
        ]
      },
    {
        "id": 44,
        "difficulty": 4,
        "name": "F and Bb Sus Barres",
        "chords": [
          "Fsus2",
          "Fsus4",
          "Bbsus2",
          "Bbsus4"
        ],
        "description": "A suspended-chord barre workout around F and Bb, useful for strengthening first-position and A-shape barre control.",
        "tags": [
          "Rock",
          "Suspended Chords",
          "Barre Chords"
        ]
      },
    {
        "id": 45,
        "difficulty": 5,
        "name": "Sus2 Planing Drill",
        "chords": [
          "Dbsus2",
          "Ebsus2",
          "F#sus2",
          "Absus2"
        ],
        "description": "A difficult suspended-chord planing drill through less common roots, more useful as a modern ambient/post-rock guitar workout than a standard cadence.",
        "tags": [
          "Experimental",
          "Post-Rock",
          "Suspended Chords",
          "Barre Chords",
          "Chromatic Movement",
          "Technical Drill"
        ]
      },
    {
        "id": 46,
        "difficulty": 5,
        "name": "Sus4 Planing Drill",
        "chords": [
          "Dbsus4",
          "Ebsus4",
          "F#sus4",
          "Absus4"
        ],
        "description": "A demanding sus4 planing drill for advanced guitar practice, built around uncommon roots and full movable shapes rather than functional harmony.",
        "tags": [
          "Experimental",
          "Post-Rock",
          "Suspended Chords",
          "Barre Chords",
          "Chromatic Movement",
          "Technical Drill"
        ]
      },
    {
        "id": 47,
        "difficulty": 1,
        "name": "Classic Rock Mixolydian",
        "chords": [
          "D",
          "C",
          "G",
          "D"
        ],
        "description": "A staple rock movement using I-bVII-IV-I color, very guitar-friendly with open-position shapes.",
        "tags": [
          "Rock",
          "Classic Rock",
          "Open Chords",
          "Mixolydian"
        ]
      },
    {
        "id": 48,
        "difficulty": 1,
        "name": "Minor Rock Anthem",
        "chords": [
          "Em",
          "C",
          "D",
          "Em"
        ],
        "description": "A common minor rock loop with easy open chords and strong bVI-bVII-i resolution energy.",
        "tags": [
          "Rock",
          "Alternative Rock",
          "Minor Key",
          "Open Chords"
        ]
      },
    {
        "id": 49,
        "difficulty": 2,
        "name": "Andalusian Rock Descent",
        "chords": [
          "Am",
          "G",
          "F",
          "E"
        ],
        "description": "A classic descending minor progression used across rock, flamenco-rock, and dramatic ballads; F adds a barre-chord challenge.",
        "tags": [
          "Rock",
          "Flamenco",
          "Minor Key",
          "Barre Chords"
        ]
      },
    {
        "id": 50,
        "difficulty": 2,
        "name": "Hard Rock bVI-bVII",
        "chords": [
          "E",
          "C",
          "D",
          "E"
        ],
        "description": "A hard-rock and metal-friendly loop built on bVI and bVII movement back to E, using strong open-position chord grips.",
        "tags": [
          "Rock",
          "Hard Rock",
          "Metal",
          "Open Chords"
        ]
      },
    {
        "id": 51,
        "difficulty": 2,
        "name": "Rockabilly Blues Turnaround",
        "chords": [
          "E",
          "A",
          "B7",
          "E"
        ],
        "description": "A guitar-standard I-IV-V7 rockabilly and early rock turnaround with familiar open E and A shapes plus B7.",
        "tags": [
          "Rock",
          "Rockabilly",
          "Blues",
          "Dominant 7ths",
          "Open Chords"
        ]
      },
    {
        "id": 52,
        "difficulty": 1,
        "name": "Pop Punk Axis",
        "chords": [
          "G",
          "D",
          "Em",
          "C"
        ],
        "description": "A very common modern rock and pop-punk I-V-vi-IV loop using comfortable open guitar shapes.",
        "tags": [
          "Rock",
          "Pop Punk",
          "Pop",
          "Open Chords"
        ]
      },
    {
        "id": 53,
        "difficulty": 2,
        "name": "Arena Rock Suspensions",
        "chords": [
          "D",
          "Dsus4",
          "G",
          "Gsus2"
        ],
        "description": "A suspended-chord rock workout for practicing the D and G embellishments common in arena rock and acoustic rock parts.",
        "tags": [
          "Rock",
          "Arena Rock",
          "Suspended Chords",
          "Open Chords"
        ]
      },
    {
        "id": 54,
        "difficulty": 2,
        "name": "Grunge Major Color",
        "chords": [
          "E",
          "G",
          "A",
          "C"
        ],
        "description": "A non-diatonic major-chord loop with grunge and alternative-rock flavor, still easy to grip in open position.",
        "tags": [
          "Rock",
          "Grunge",
          "Alternative Rock",
          "Open Chords"
        ]
      },
    {
        "id": 55,
        "difficulty": 3,
        "name": "British Rock Lift",
        "chords": [
          "A",
          "C",
          "D",
          "E7"
        ],
        "description": "A bright rock lift through bIII and IV before the E7 turnaround, useful for blues-rock and classic-rock rhythm guitar.",
        "tags": [
          "Rock",
          "Classic Rock",
          "Blues",
          "Dominant 7ths"
        ]
      },
    {
        "id": 56,
        "difficulty": 4,
        "name": "Barre Chord Rock in F",
        "chords": [
          "F",
          "Eb",
          "Bb",
          "C"
        ],
        "description": "A rock-friendly bVII-IV-V movement in F that is excellent for practicing linked E-shape and A-shape barre chords.",
        "tags": [
          "Rock",
          "Classic Rock",
          "Barre Chords",
          "Mixolydian"
        ]
      }

    ];