'use client'

import { Link } from "react-router";
import { useSearchParams } from "react-router";


export default function StartChallenge() {

    const [searchParams] = useSearchParams();

    const instrument = searchParams.get("instrument") ?? "";
    const difficulty = searchParams.get("difficulty") ?? "";

  return (
    <main>
      <Link to="/"><button className="btn-action-back"> ← Go Back</button></Link>

    </main>
  );
}
