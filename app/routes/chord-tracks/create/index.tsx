'use client'

import TrackEditor from '~/components/chordTracks/TrackEditor';
import { Button } from "flowbite-react";
import { Link } from "react-router";

export default function CreateTrack() {

  return (
      <>
          <Link key="back" className="m-5" to={`/chord-tracks`}> <Button as="span" color="teal" pill> ← Go Back</Button></Link> 

          <TrackEditor TrackData={null} Id={""} />
      </>
  );
}
