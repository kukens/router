'use client'

import AudioAnalyzer from '~/components/AudioAnalyzer';
import TrackPlayer from '~/components/TrackPlayer';
import { ChordProvider } from '~/features/audio/ChordContext';
import { Button } from "flowbite-react";
import { Link, useParams} from "react-router";

export default function PlayTrack() {

  const params = useParams();
  const { id } = params;

  return (
      <>
       <Link key="back" className="m-5" to={`/chord-tracks/${id}`}> <Button className="m-2" as="span" color="teal" pill> ← Go Back</Button></Link> 

        <ChordProvider>
          <TrackPlayer id={id as string} />
          <AudioAnalyzer />
        </ChordProvider>
      </>
  );
}
