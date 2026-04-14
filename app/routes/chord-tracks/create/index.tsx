'use client'

import TrackEditor from '~/components/chordTracks/TrackEditor';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@base-ui/react/button';
import { Link } from "react-router";
import pageStyles from "~/theme/Page.module.css";
import PageHeader from '~/components/shared/PageHeader';

export default function CreateTrack() {

  return (
      <>
        <PageHeader title="New Chord Track" backLink="/chord-tracks" />
          <TrackEditor TrackData={null} Id={""} />
      </>
  );
}
