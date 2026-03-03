'use client';

import { useState, useRef } from 'react';
import { Button } from "flowbite-react";

import { EmptyTrackData } from '~/types/TrackData';
import type { TrackData } from '~/types/TrackData';
import type { WorkOutTrack } from "~/data/workOutTracks";
import TrackPlayer from '~/components/TrackPlayer';

interface WorkOutTrackProps {
    WorkOutTracks: WorkOutTrack[]
}

export default function WorkOutTrackPlayer(props: WorkOutTrackProps) {

    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    
    // Convert all tracks to TrackData once and store in ref
    const convertedTracksRef = useRef(props.WorkOutTracks.map(track => ({
        id: String(track.id),
        name: track.name,
        tags: [],
        tempo: 120,
        beatsPerBar: 4,
        loop: false,
        bars: track.chords.map(chord => ({
            chords: [chord, chord, chord, chord]
        }))
    })));

    const trackData = (() => {
        const tracks = convertedTracksRef.current;
        return tracks[currentTrackIndex] ?? tracks[0] ?? EmptyTrackData;
    })();

    const goToNextTrack = () => {
        setCurrentTrackIndex((prevIndex) => 
            prevIndex < props.WorkOutTracks.length - 1 ? prevIndex + 1 : 0
        );
    };

    const goToPreviousTrack = () => {
        setCurrentTrackIndex((prevIndex) => 
            prevIndex > 0 ? prevIndex - 1 : props.WorkOutTracks.length - 1
        );
    };

    return (
        <div>
            <h2>{trackData.name}</h2>
           <TrackPlayer key={trackData.id}  TrackData={trackData} />
           <p>Playing {currentTrackIndex + 1} from {props.WorkOutTracks.length} tracks</p>
           
           <div className="flex justify-center gap-4 mt-4">
                <Button 
                    onClick={goToPreviousTrack} 
                    color="teal" 
                    pill
                    disabled={props.WorkOutTracks.length <= 1}
                >
                    ← Previous
                </Button>
                <Button 
                    onClick={goToNextTrack} 
                    color="teal" 
                    pill
                    disabled={props.WorkOutTracks.length <= 1}
                >
                    Next →
                </Button>
           </div>
        </div>
    )
}