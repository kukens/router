'use client'

import TrackEditor from '~/components/TrackEditor';
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
          <Link key="back" className="m-5" to={`/chord-tracks/${id}`}> <Button as="span" color="teal" pill> ← Go Back</Button></Link>
          <TrackEditor TrackData={trackData} Id={id as string} />
    </>
  );
}
