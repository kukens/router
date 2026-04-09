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


        <div className={pageStyles.pageHeader}>
            <Link to={`/chord-tracks/${id}`}><Button className="btn-action-back" ><ArrowLeft size={20} strokeWidth={1.5} /> </Button></Link>
             <h1>{trackData?.name}</h1>
             <Button className="btn-action-back" style={{visibility: 'hidden'}} ><ArrowLeft size={20} strokeWidth={1.5} /> </Button>
        </div>

        <ChordProvider>
          <ChordTracksPlayer TrackData={trackData} />
          <AudioAnalyzer />
        </ChordProvider>
      </>
  );
}
