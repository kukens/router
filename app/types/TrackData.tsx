export interface TrackData {
    id: string;
    name: string;
    tempo: number;
    beatsPerBar: number;
    loop: boolean;
    bars: Bar[];
    tags: string[];
    createdAt?: string;
    modifiedAt?: string;
}

export const EmptyTrackData: TrackData = {
    id: "",
    name: "",
    tempo: 0,
    beatsPerBar: 0,
    loop: false,
    bars: [],
    tags: [],
}

export interface Bar {
    chords: string[];
}