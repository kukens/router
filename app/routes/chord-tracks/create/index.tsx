'use client'

import TrackEditor from '~/components/chordTracks/TrackEditor';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@base-ui/react/button';
import { Link } from "react-router";
import pageStyles from "~/theme/Page.module.css";

export default function CreateTrack() {

  return (
      <>
         <div className={pageStyles.pageHeader}>
            <Link to="/chord-tracks"><Button className="btn-action-back" ><ArrowLeft size={25} /> </Button></Link>
            <h1>New Chord Track</h1>
        </div>
          <TrackEditor TrackData={null} Id={""} />
      </>
  );
}
