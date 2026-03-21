'use client'

import AudioAnalyzer from '~/components/AudioAnalyzer';
import { ChordProvider } from '~/features/audio/ChordContext';
import { Button } from '@base-ui/react/button';
import { Link, useSearchParams } from "react-router";
import WorkOutTrackPlayer from '~/components/workOut/WorkOutTrackPlayer';
import { useLocation } from 'react-router';
import type { WorkOutTrack } from '~/data/workOutTracks';
import { ArrowLeft } from 'lucide-react';

interface WorkOutTracksState {
  WorkOutTracks: WorkOutTrack[];
}

export default function PlayTrack() {

const location = useLocation();
const locationState = location.state as WorkOutTracksState;

console.log(locationState.WorkOutTracks)

  return (
      <>
            <Link to="/workout"><Button className="btn-action-back" ><ArrowLeft size={25} /> </Button></Link>

        <ChordProvider>
          <WorkOutTrackPlayer WorkOutTracks={locationState.WorkOutTracks} />
          <AudioAnalyzer />
        </ChordProvider>
      </>
  );
}
