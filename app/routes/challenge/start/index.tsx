'use client'

import AudioAnalyzer from '~/components/AudioAnalyzer';
import ChallengePlayer from '~/components/ChallengePlayer';
import { ChordProvider } from '~/features/audio/ChordContext';
import { Button } from "flowbite-react";
import { Link, useSearchParams } from "react-router";


export default function PlayTrack() {

 const [searchParams] = useSearchParams();

const instrument = searchParams.get("instrument") ?? "";
const difficulty = searchParams.get("difficulty") ?? "";

  return (
      <>
          <Link key="back" className="m-5" to={`/challenge?instrument=${instrument}&difficulty=${difficulty}`}> <Button className="m-2" as="span" color="teal" pill> ← Go Back</Button></Link> 

        <ChordProvider>
          <ChallengePlayer instrument={instrument} difficulty={difficulty} />
          <AudioAnalyzer />
        </ChordProvider>
      </>
  );
}
