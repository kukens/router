"use client";

import { useEffect, useState } from 'react';
import type { TrackData } from '~/types/TrackData';
import styles from './Bars.module.css';
import { Link, useNavigate } from "react-router";
import { Button } from 'flowbite-react';
import { HR } from "flowbite-react";

interface TrackDetailsProps {
    TrackData: TrackData | null
}

export default function TrackDetails(props: TrackDetailsProps) {

    const [tracks, setTracks] = useState<TrackData[]>([])
    const navigate = useNavigate();

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


    const deleteTrack = () => {
        localStorage.removeItem(`trackData-${props.TrackData?.id}`);
        navigate('/chord-tracks');
    };

    return (
        <div>
            <h2 className="dark:text-white text-center">{props.TrackData?.name}</h2>
            <p className="dark:text-white text-center">Tempo: {props.TrackData?.tempo} </p>

            <Link className="m-5" to={`/chord-tracks/${props.TrackData?.id}/play`}><Button as="span" color="teal" pill >Play</Button></Link>
            <Link className="m-5" to={`/chord-tracks/${props.TrackData?.id}/edit`}><Button as="span" color="teal" pill >Edit</Button></Link>
            <Button onClick={deleteTrack} as="span" color="teal" pill>Delete</Button>

            <HR />

            <div className="bars relative overflow-hidden h-96">
                <div className="slider-verticalx">
                    {props.TrackData?.bars.map((bar, i) => (
                        <div key={i} className="bar-wrapper flex items-center">
                            <div className={`${styles['bar']} grid grid-cols-${props.TrackData?.beatsPerBar} gap-1 w-full p-1`}>
                                {bar.chords.map((chord, j) => (
                                    <div key={j} className={`${styles['beat']} rounded-sm bg-gray-500 p-5 text-center`} data-chord={chord}>
                                        {chord.replace("b", "♭").replace("#", "♯")}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
