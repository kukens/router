"use client";

import { useEffect, useState } from 'react';
import type { TrackData } from '~/types/TrackData';
import styles from './Bars.module.css';

interface TrackDetailsProps {
    TrackData: TrackData | null
}


export default function TrackDetails(props: TrackDetailsProps) {

  const [tracks, setTracks] = useState<TrackData[]>([])

  useEffect(() => {
    const tempTracks: TrackData[] = [];

    for (const key in localStorage) {
      if (key?.startsWith("trackData")) {
        const value = localStorage.getItem(key) ?? "";
        const track = JSON.parse(value) as TrackData;
        tempTracks.push(track);
      }
    }

    setTracks(tempTracks);

  }, []);

  return (
<div className="bars relative overflow-hidden h-96">
            <div className="slider-verticalx">
                {props.TrackData?.bars.map((bar, i) => (
                    <div key={i} className="bar-wrapper flex items-center">
                        <div className={`${styles['bar']} grid grid-cols-4 gap-1 w-full p-1`}>
                            {bar.chords.map((chord, j) => (
                                <div key={j} className={`${styles['beat']} rounded-sm bg-gray-500 p-5 text-center`} data-chord={chord}>
                                    {chord}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>

  );
}
