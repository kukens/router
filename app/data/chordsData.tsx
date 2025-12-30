export interface ChordsData {
    name: string;
    chords: Chord[];
}

export interface Chord {
    name: string;
    notes: string[];
}

export const CHORDS_DATA: ChordsData[] = [
    {
        "name": "major", "chords": [
            { "name": "C", "notes": ["C", "E", "G"] },
            { "name": "Db", "notes": ["C#", "F", "G#"] },
            { "name": "D", "notes": ["D", "F#", "A"] },
            { "name": "Eb", "notes": ["D#", "G", "A#"] },
            { "name": "E", "notes": ["E", "G#", "B"] },
            { "name": "F", "notes": ["F", "A", "C"] },
            { "name": "F#", "notes": ["F#", "A#", "C#"] },
            { "name": "G", "notes": ["G", "B", "D"] },
            { "name": "Ab", "notes": ["G#", "C", "D#"] },
            { "name": "A", "notes": ["A", "C#", "E"] },
            { "name": "Bb", "notes": ["A#", "D", "F"] },
            { "name": "B", "notes": ["B", "D#", "F#"] }]
    },
    {
        "name": "minor", "chords": [
            { "name": "Cm", "notes": ["C", "D#", "G"] },
            { "name": "C#m", "notes": ["C#", "E", "G#"] },
            { "name": "Dm", "notes": ["D", "F", "A"] },
            { "name": "Ebm", "notes": ["D#", "F#", "A#"] },
            { "name": "Em", "notes": ["E", "G", "B"] },
            { "name": "Fm", "notes": ["F", "G#", "C"] },
            { "name": "F#m", "notes": ["F#", "A", "C#"] },
            { "name": "Gm", "notes": ["G", "A#", "D"] },
            { "name": "G#m", "notes": ["G#", "B", "D#"] },
            { "name": "Am", "notes": ["A", "C", "E"] },
            { "name": "Bbm", "notes": ["A#", "C#", "F"] },
            { "name": "Bm", "notes": ["B", "D", "F#"] },]
    },
    {
        "name": "7th", "chords": [
            { "name": "C7", "notes": ["C", "E", "G", "A#"] },
            { "name": "Db7", "notes": ["C#", "F", "G#", "B"] },
            { "name": "D7", "notes": ["D", "F#", "A", "C"] },
            { "name": "Eb7", "notes": ["D#", "G", "A#", "C#"] },
            { "name": "E7", "notes": ["E", "G#", "B", "D"] },
            { "name": "F7", "notes": ["F", "A", "C", "D#"] },
            { "name": "F#7", "notes": ["F#", "A#", "C#", "E"] },
            { "name": "G7", "notes": ["G", "B", "D", "F"] },
            { "name": "Ab7", "notes": ["G#", "C", "D#", "F#"] },
            { "name": "A7", "notes": ["A", "C#", "E", "G"] },
            { "name": "Bb7", "notes": ["A#", "D", "F", "G#"] },
            { "name": "B7", "notes": ["B", "D#", "F#", "A"] },]
    },
    {
        "name": "dim", "chords": [
            { "name": "Cdim", "notes": ["C", "D#", "F#"] },
            { "name": "C#dim", "notes": ["C#", "E", "G"] },
            { "name": "Ddim", "notes": ["D", "F", "G#"] },
            { "name": "Ebdim", "notes": ["D#", "F#", "A"] },
            { "name": "Edim", "notes": ["E", "G", "A#"] },
            { "name": "Fdim", "notes": ["F", "G#", "B"] },
            { "name": "F#dim", "notes": ["F#", "A", "C"] },
            { "name": "Gdim", "notes": ["G", "A#", "C#"] },
            { "name": "G#dim", "notes": ["G#", "B", "D"] },
            { "name": "Adim", "notes": ["A", "C", "D#"] },
            { "name": "Bbdim", "notes": ["A#", "C#", "E"] },
            { "name": "Bdim", "notes": ["B", "D", "F"] }]
    },
    {
        "name": "dim7", "chords": [
            { "name": "Cdim7", "notes": ["C", "D#", "F#", "A"] },
            { "name": "C#dim7", "notes": ["C#", "E", "G", "A#"] },
            { "name": "Ddim7", "notes": ["D", "F", "G#", "B"] },
            { "name": "Ebdim7", "notes": ["D#", "F#", "A", "C"] },
            { "name": "Edim7", "notes": ["E", "G", "A#", "C#"] },
            { "name": "Fdim7", "notes": ["F", "G#", "B", "D"] },
            { "name": "F#dim7", "notes": ["F#", "A", "C", "D#"] },
            { "name": "Gdim7", "notes": ["G", "A#", "C#", "E"] },
            { "name": "G#dim7", "notes": ["G#", "B", "D", "F"] },
            { "name": "Adim7", "notes": ["A", "C", "D#", "F#"] },
            { "name": "Bbdim7", "notes": ["A#", "C#", "E", "G"] },
            { "name": "Bdim7", "notes": ["B", "D", "F", "G#"] }]
    },
    {
        "name": "aug", "chords": [
            { "name": "Caug", "notes": ["C", "E", "G#"] },
            { "name": "Dbaug", "notes": ["C#", "F", "A"] },
            { "name": "Daug", "notes": ["D", "F#", "A#"] },
            { "name": "Ebaug", "notes": ["D#", "G", "B"] },
            { "name": "Eaug", "notes": ["E", "G#", "C"] },
            { "name": "Faug", "notes": ["F", "A", "C#"] },
            { "name": "F#aug", "notes": ["F#", "A#", "D"] },
            { "name": "Gaug", "notes": ["G", "B", "D#"] },
            { "name": "Abaug", "notes": ["G#", "C", "E"] },
            { "name": "Aaug", "notes": ["A", "C#", "F"] },
            { "name": "Bbaug", "notes": ["A#", "D", "F#"] },
            { "name": "Baug", "notes": ["B", "D#", "G"] }]
    },
    {
        "name": "sus2", "chords": [
            { "name": "Csus2", "notes": ["C", "D", "G"] },
            { "name": "Dbsus2", "notes": ["C#", "D#", "G#"] },
            { "name": "Dsus2", "notes": ["D", "E", "A"] },
            { "name": "Ebsus2", "notes": ["D#", "F", "A#"] },
            { "name": "Esus2", "notes": ["E", "F#", "B"] },
            { "name": "Fsus2", "notes": ["F", "G", "C"] },
            { "name": "F#sus2", "notes": ["F#", "G#", "C#"] },
            { "name": "Gsus2", "notes": ["G", "A", "D"] },
            { "name": "Absus2", "notes": ["G#", "A#", "D#"] },
            { "name": "Asus2", "notes": ["A", "B", "E"] },
            { "name": "Bbsus2", "notes": ["A#", "C", "F"] },
            { "name": "Bsus2", "notes": ["B", "C#", "F#"] }]
    },
    {
        "name": "sus4", "chords": [
            { "name": "Csus4", "notes": ["C", "F", "G"] },
            { "name": "Dbsus4", "notes": ["C#", "F#", "G#"] },
            { "name": "Dsus4", "notes": ["D", "G", "A"] },
            { "name": "Ebsus4", "notes": ["D#", "G#", "A#"] },
            { "name": "Esus4", "notes": ["E", "A", "B"] },
            { "name": "Fsus4", "notes": ["F", "A#", "C"] },
            { "name": "F#sus4", "notes": ["F#", "B", "C#"] },
            { "name": "Gsus4", "notes": ["G", "C", "D"] },
            { "name": "Absus4", "notes": ["G#", "C#", "D#"] },
            { "name": "Asus4", "notes": ["A", "D", "E"] },
            { "name": "Bbsus4", "notes": ["A#", "D#", "F"] },
            { "name": "Bsus4", "notes": ["B", "E", "F#"] }]
    }
]
