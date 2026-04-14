'use client'

import TrackEditor from '~/components/chordTracks/TrackEditor';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@base-ui/react/button';
import { Link, useParams } from "react-router";
import { useEffect, useState } from 'react';
import type { TrackData } from '~/types/TrackData';
import pageStyles from "~/theme/Page.module.css";
import PageHeader from '~/components/shared/PageHeader';

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
        <PageHeader title="Edit Chord Track" backLink={`/chord-tracks/${id}`} />

          <TrackEditor TrackData={trackData} Id={id as string} />
    </>
  );
}
