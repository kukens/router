'use client'

import ChordProgressionCreator from '~/components/ChordProgressionCreator';
import { Button } from "flowbite-react";
import { Link } from "react-router";

export default function CreateTrack() {

  return (
      <>
           <Link key="back" className="m-5" to={`/`}> <Button as="span" color="teal" pill> ← Go Back</Button></Link> 


        <ChordProgressionCreator TrackData={null} Id={""} />
      </>
  );
}
