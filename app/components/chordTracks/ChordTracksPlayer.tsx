'use client';

import type { TrackData } from '~/types/TrackData';
import TrackPlayer from "~/components/TrackPlayer";
import styles from "./ChordTracksPlayer.module.css";

interface ChordTracksPlayerProps {
    TrackData: TrackData | null
}

export default function ChordTracksPlayer(props: ChordTracksPlayerProps) {

    return (
        <>
            {props.TrackData &&

            <>
            <div> </div>
        
                    <TrackPlayer TrackData={props.TrackData} />
              <div> </div>

              </>
            }
        </>
    )
}