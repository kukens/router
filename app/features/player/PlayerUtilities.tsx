import type { TrackData } from "~/types/TrackData";

  export function createModel(input: number): TrackData {
    return (input / 200) * 3;
  }