export interface TrackData {
  id: string;
  name: string;
  tempo: number;
  loop: boolean;
  bars: Bar[];
}

export const EmptyTrackData: TrackData = {
    id: "",
    name: "",
    tempo: 0,
    loop: false,
    bars: [],
}

export interface Bar {
  chords: string[];
}