"use client";

import { useEffect, useState } from 'react';
import { useParams, Link } from "react-router";

import type { TrackData } from '~/types/TrackData';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@base-ui/react/button';
import TrackDetails from '~/components/chordTracks/TrackDetails';
import pageStyles from "~/theme/Page.module.css";

export default function Tracks() {

    const params = useParams();
    const { id } = params;

    const [trackData, setTrackData] = useState<TrackData | null>(null)

    useEffect(() => {
        const trackDataFromLocalStorage = JSON.parse(localStorage.getItem(`trackData-${id}`) ?? "") as TrackData;
        setTrackData(trackDataFromLocalStorage)
    }, []);

    return (
        <>
        <div className={pageStyles.pageHeader}>
            <Link to={`/chord-tracks`}><Button className="btn-action-back" ><ArrowLeft size={20} strokeWidth={1.5} /> </Button></Link>
            <h1>{trackData?.name}</h1>
        </div>

        <TrackDetails TrackData={trackData} />
        </>
    );
}
