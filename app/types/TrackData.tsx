export interface TrackData {
  id: string;
  name: string;
  tempo: number;
  loop: boolean;
  bars: Bar[];
}

export interface Bar {
  chords: string[];
}