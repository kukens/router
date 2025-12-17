export interface SpectrumEntry {
  freq: number;
  magnitude: number;
}

export interface AnalysisResult {
  audioData: CurrentAudioData;
  hitsData: HitsData | null;
  evaluatedChords: EvaluatedChord[]
}

export interface CurrentAudioData {
  mean: number;
  rms: number;
  peaks: SpectrumEntry[];
}

export interface HitsData {
  meanScore: number;
  rmsScore: number;
  meanFrequencyHits: number;
  rmsFrequencyHits: number;
  familyScores: [string, number][];
}

export interface MatchedNoteData {
  note: string
  family: string
  score: number
  magnitudes: number[]
  frequencies: number[]
}

export interface EvaluatedChord {
  chordName: string
  notes: string[]
  score: number
}