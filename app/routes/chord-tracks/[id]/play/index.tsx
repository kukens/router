'use client'

import AudioAnalyzer from '~/components/AudioAnalyzer';
import ChordTracksPlayer from '~/components/chordTracks/ChordTracksPlayer';
import { ChordProvider } from '~/features/audio/ChordContext';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@base-ui/react/button';
import { Link, useParams} from "react-router";
import type { TrackData } from '~/types/TrackData';
import { useEffect, useState } from 'react';
import pageStyles from "~/theme/Page.module.css";
import PageHeader from '~/components/shared/PageHeader';

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


        <PageHeader title={trackData?.name ?? ""} backLink={`/chord-tracks/${id}`} />

        <ChordProvider>
          <ChordTracksPlayer TrackData={trackData} />
          <AudioAnalyzer />
        </ChordProvider>
      </>
  );
}
