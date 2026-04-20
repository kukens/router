"use client";

import { useEffect, useState } from 'react';
import type { TrackData } from '~/types/TrackData';
import { Link, useNavigate } from "react-router";
import { Button } from '@base-ui/react/button';
import styles from "./TrackDetails.module.css"

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
        <div className={styles.container}>
            <Link to={`/chord-tracks/${props.TrackData?.id}/play`}><Button className="btn-action" nativeButton={false}>Play</Button></Link>
            
            <div className={styles.actionButtons}>
            <Link to={`/chord-tracks/${props.TrackData?.id}/edit`}><Button className="btn-action-alt" nativeButton={false}>Edit</Button></Link>
            <Button className="btn-action-alt" onClick={deleteTrack}>Delete</Button>

    
            </div>

            <p>Tempo: {props.TrackData?.tempo} </p>

            <div className={styles.bars}>
                      {props.TrackData?.bars?.map((bar, barIndex) => (
                        <div className={styles.bar}>
                            {Array.from({ length: props.TrackData?.beatsPerBar || 4 }).map((_, beatIndex) => (
                                 
                                 <Button key={beatIndex} className={`btn-disabled ${styles.beat}`}>
                                    {props.TrackData?.bars[barIndex].chords[beatIndex]?.replace("b", "♭").replace("#", "♯") || ""}</Button>
                            ))}
                        </div>
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
