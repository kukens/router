'use client';

import type { TrackData } from '~/types/TrackData';
import TrackPlayer from "~/components/TrackPlayer";

interface ChordTracksPlayerProps {
    TrackData: TrackData | null
}

export default function ChordTracksPlayer(props: ChordTracksPlayerProps) {

    return (
        <>
            {props.TrackData &&
                <div>
                    <p>{props.TrackData?.name ?? 'No track selected'}</p>
                    <TrackPlayer TrackData={props.TrackData} />
                </div>
            }
        </>
    )
}