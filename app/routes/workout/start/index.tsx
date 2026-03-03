'use client'

import AudioAnalyzer from '~/components/AudioAnalyzer';
import { ChordProvider } from '~/features/audio/ChordContext';
import { Button } from "flowbite-react";
import { Link, useSearchParams } from "react-router";
import WorkOutTrackPlayer from '~/components/workOut/WorkOutTrackPlayer';
import { useLocation } from 'react-router';
import type { WorkOutTrack } from '~/data/workOutTracks';

interface WorkOutTracksState {
  WorkOutTracks: WorkOutTrack[];
}

export default function PlayTrack() {

const location = useLocation();
const locationState = location.state as WorkOutTracksState;

console.log(locationState.WorkOutTracks)

  return (
      <>
       <Link key="back" className="m-5" to={`/workout`}> <Button className="m-2" as="span" color="teal" pill> ← Go Back</Button></Link> 

        <ChordProvider>
          <WorkOutTrackPlayer WorkOutTracks={locationState.WorkOutTracks} />
          <AudioAnalyzer />
        </ChordProvider>
      </>
  );
}
