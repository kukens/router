"use client";

import { useEffect, useState } from 'react';
import { useParams, Link } from "react-router";

import type { TrackData } from '~/types/TrackData';
import { Button } from "flowbite-react";
import TrackDetails from '~/components/TrackDetails';

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
            <Link key="back" className="m-5" to={`/chord-tracks`}> <Button as="span" color="teal" pill> ← Go Back</Button></Link>

            <TrackDetails TrackData={trackData} />
        </>
    );
}
