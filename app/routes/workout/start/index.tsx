'use client'

import { useEffect, useState } from 'react';
import AudioAnalyzer from '~/components/AudioAnalyzer';
import { ChordProvider } from '~/features/audio/ChordContext';
import WorkOutTrackPlayer from '~/components/workOut/WorkOutTrackPlayer';
import { Navigate, useNavigate } from 'react-router';
import type { WorkOutTrack } from '~/data/workOutTracks';
import PageHeader from '~/components/shared/PageHeader';

const WORKOUT_STORAGE_KEY: string = 'chordsArenaWorkOut';

export default function PlayTrack() {
  const [workOutTracks, setWorkOutTracks] = useState<WorkOutTrack[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedWorkout = JSON.parse(
        localStorage.getItem(WORKOUT_STORAGE_KEY) ?? '[]'
      ) as WorkOutTrack[];

      if (storedWorkout.length === 0) {
        navigate('/workout', { replace: true });
        return;
      }

      setWorkOutTracks(storedWorkout);
    } catch {
      localStorage.removeItem(WORKOUT_STORAGE_KEY);
      navigate('/workout', { replace: true });
    }
  }, [navigate]);


  return (
      <>
        <PageHeader title="Workout" backLink="/workout" />

   {workOutTracks.length > 0 ? (
        <ChordProvider>
          <WorkOutTrackPlayer WorkOutTracks={workOutTracks} />
          <AudioAnalyzer />
        </ChordProvider>
      ) : null}   
      </>
  );
}
