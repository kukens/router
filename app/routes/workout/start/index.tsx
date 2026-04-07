'use client'

import AudioAnalyzer from '~/components/AudioAnalyzer';
import { ChordProvider } from '~/features/audio/ChordContext';
import { Button } from '@base-ui/react/button';
import { Link } from "react-router";
import WorkOutTrackPlayer from '~/components/workOut/WorkOutTrackPlayer';
import { useLocation } from 'react-router';
import type { WorkOutTrack } from '~/data/workOutTracks';
import { ArrowLeft } from 'lucide-react';

import pageStyles from "~/theme/Page.module.css";


interface WorkOutTracksState {
  WorkOutTracks: WorkOutTrack[];
}

export default function PlayTrack() {

const location = useLocation();
const locationState = location.state as WorkOutTracksState;

console.log(locationState.WorkOutTracks)

  return (
      <>
              <div className={pageStyles.pageHeader}>
            <Link to="/workout"><Button className="btn-action-back" ><ArrowLeft size={20} strokeWidth={1.5} /> </Button></Link>
            <h1>Workout</h1>
        </div>

        <ChordProvider>
          <WorkOutTrackPlayer WorkOutTracks={locationState.WorkOutTracks} />
          <AudioAnalyzer />
        </ChordProvider>
      </>
  );
}
