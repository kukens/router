'use client'

import TrackEditor from '~/components/chordTracks/TrackEditor';
import PageHeader from '~/components/shared/PageHeader';

export default function CreateTrack() {

  return (
      <>
        <PageHeader title="New Chord Track" backLink="/chord-tracks" />
          <TrackEditor TrackData={null} Id={""} />
      </>
  );
}
