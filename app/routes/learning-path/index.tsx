'use client'

import { Button } from "flowbite-react";
import { Link } from "react-router";
import { useSearchParams } from "react-router";


export default function StartChallenge() {

    const [searchParams] = useSearchParams();

    const instrument = searchParams.get("instrument") ?? "";
    const difficulty = searchParams.get("difficulty") ?? "";

  return (
    <main className="">
      <Link className="m-5" to="/"><Button className="m-5 mb-10" as="span" color="teal" pill> ← Go Back</Button></Link>

    </main>
  );
}
