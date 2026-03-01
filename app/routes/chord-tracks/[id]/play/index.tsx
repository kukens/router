'use client'

import AudioAnalyzer from '~/components/AudioAnalyzer';
import TrackPlayer from '~/components/TrackPlayer';
import { ChordProvider } from '~/features/audio/ChordContext';
import { Button } from "flowbite-react";
import { Link, useParams} from "react-router";
import type { TrackData } from '~/types/TrackData';
import { useEffect, useState } from 'react';

export default function PlayTrack() {

  const params = useParams();
  const { id } = params;

    const [trackData, setTrackData] = useState<TrackData | null>(null)

    useEffect(() => {
        const trackDataFromLocalStorage = JSON.parse(localStorage.getItem(`trackData-${id}`) ?? "") as TrackData;
        setTrackData(trackDataFromLocalStorage)
    }, []);

  return (
      <>
       <Link key="back" className="m-5" to={`/chord-tracks/${id}`}> <Button className="m-2" as="span" color="teal" pill> ← Go Back</Button></Link> 

        <ChordProvider>
          <TrackPlayer TrackData={trackData} />
          <AudioAnalyzer />
        </ChordProvider>
      </>
  );
}
