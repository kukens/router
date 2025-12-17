'use client'

import ChordProgressionCreator from '~/components/ChordProgressionCreator';
import { Button } from "flowbite-react";
import { Link, useParams } from "react-router";
import { useEffect, useState } from 'react';
import type { TrackData } from '~/types/TrackData';

export default function EditTrack() {

  const params = useParams();
  const { id } = params;
  const [trackData, setTrackData] = useState<TrackData | null>(null)

  useEffect(() => {
    const trackDataFromLocalStorage = JSON.parse(localStorage.getItem(`trackData-${id}`) ?? "") as TrackData;
    setTrackData(trackDataFromLocalStorage)
  }, []);


  return (
    <>
      <Link key="back" className="m-5" to={`/`}> <Button as="span" color="teal" pill> ← Go Back</Button></Link>
      <ChordProgressionCreator TrackData={trackData} Id={id as string} />
    </>
  );
}
