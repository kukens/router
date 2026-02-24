'use client'

import { Button } from "flowbite-react";
import { Link } from "react-router";
import { default as TrackList } from "~/components/TrackList"
import { HR } from "flowbite-react";

export default function StartChallenge() {

    return (
        <main className="">

            <Link className="m-5" to="/"><Button className="m-5 mb-10" as="span" color="teal" pill> ← Go Back</Button></Link>

            <TrackList />

            <HR />

            <Link className="m-5" to="/chord-tracks/create"><Button className="m-2" as="span" color="teal" pill >Add new track</Button></Link>

        </main>
    );
}
