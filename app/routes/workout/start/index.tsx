'use client'

import AudioAnalyzer from '~/components/AudioAnalyzer';
import { ChordProvider } from '~/features/audio/ChordContext';
import { Button } from '@base-ui/react/button';
import { Link } from "react-router";
import WorkOutTrackPlayer from '~/components/workOut/WorkOutTrackPlayer';
import { useLocation } from 'react-router';
import type { WorkOutTrack } from '~/data/workOutTracks';
import { ArrowLeft } from 'lucide-react';
import PageHeader from '~/components/shared/PageHeader';

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
        <PageHeader title="Workout" backLink="/workout" />

        <ChordProvider>
          <WorkOutTrackPlayer WorkOutTracks={locationState.WorkOutTracks} />
          <AudioAnalyzer />
        </ChordProvider>
      </>
  );
}
