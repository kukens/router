'use client'

import TrackEditor from '~/components/chordTracks/TrackEditor';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@base-ui/react/button';
import { Link, useParams } from "react-router";
import { useEffect, useState } from 'react';
import type { TrackData } from '~/types/TrackData';
import pageStyles from "~/theme/Page.module.css";

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
        <div className={pageStyles.pageHeader}>
            <Link to={`/chord-tracks/${id}`}><Button className="btn-action-back" ><ArrowLeft size={20} strokeWidth={1.5} /> </Button></Link>
            <h1>Edit Chord Track</h1>
            <Button className="btn-action-back" style={{visibility: 'hidden'}} ><ArrowLeft size={20} strokeWidth={1.5} /> </Button>
        </div>

          <TrackEditor TrackData={trackData} Id={id as string} />
    </>
  );
}
