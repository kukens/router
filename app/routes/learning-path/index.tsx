'use client'

import { Button } from '@base-ui/react/button';
import { useSearchParams } from "react-router";
import { useFadeNavigate } from '~/components/RouteTransition';


export default function StartChallenge() {

    const [searchParams] = useSearchParams();
  const navigate = useFadeNavigate();

    const instrument = searchParams.get("instrument") ?? "";
    const difficulty = searchParams.get("difficulty") ?? "";

  return (
    <main>
      <Button className="btn-action-back" onClick={() => navigate('/')}> ← Go Back</Button>

    </main>
  );
}
