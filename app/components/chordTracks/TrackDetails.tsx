"use client";

import { useEffect, useState } from 'react';
import type { TrackData } from '~/types/TrackData';
import { Button } from '@base-ui/react/button';
import { useFadeNavigate } from '~/components/RouteTransition';
import styles from "./TrackDetails.module.css"
import { X } from 'lucide-react';

interface TrackDetailsProps {
    TrackData: TrackData | null
}

export default function TrackDetails(props: TrackDetailsProps) {

    const [tracks, setTracks] = useState<TrackData[]>([])
    const navigate = useFadeNavigate();

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
        <div className={styles.container}>
            <Button className="btn-action" onClick={() => navigate(`/chord-tracks/${props.TrackData?.id}/play`)}>Play</Button>

            <div className={styles.actionButtons}>
                <Button className="btn-action-alt" onClick={() => navigate(`/chord-tracks/${props.TrackData?.id}/edit`)}>Edit</Button>
                <Button className="btn-action-alt" onClick={deleteTrack}>Delete</Button>


            </div>

            <p>Tempo: <span className={styles.numberLabel}>{props.TrackData?.tempo}</span></p>

            <div className={styles.bars}>
                {props.TrackData?.bars?.map((bar, barIndex) => (
                    <>
                        {!!bar.repeat && (
                            <div className={styles.repeatBlock}>
                             Repeat <span className={styles.numberLabel}> <X />{bar.repeat}</span>
                              
                            </div>
                        )}
                        <div className={`${styles.bar} ${bar.repeatEnd ? styles.repeatEnd : ''}`}>
                            {Array.from({ length: props.TrackData?.beatsPerBar || 4 }).map((_, beatIndex) => (

                                <Button key={beatIndex} className={`btn-disabled ${styles.beat}`}>
                                    {props.TrackData?.bars[barIndex].chords[beatIndex]?.replace("b", "♭").replace("#", "♯") || ""}</Button>
                            ))}
                        </div>
                    </>
                ))}
            </div>

            <div className={styles.tags}>
                <h3>Tags</h3>

                {props.TrackData?.tags?.map((tag, index) => (
                    <Button key={index} className="btn-disabled">{tag}</Button>
                ))}
            </div>


            <div className={styles.metadata}>
                {props.TrackData?.createdAt && props.TrackData.modifiedAt && (
                    <>
                        <p>Created: {new Date(props.TrackData.createdAt).toLocaleString()} </p>
                        <p>Last modified: {new Date(props.TrackData.modifiedAt).toLocaleString()} </p>
                    </>
                )}

            </div>
        </div>

    );
}
