'use client'

import { Link } from "react-router";
import { Button } from "flowbite-react";
import TrackList from "~/components/TrackList"

export default function Home() {
  return (
      <main className="">
          <Link className="m-5" to="/challenge"><Button  className="m-2" as="span" color="teal" pill >Quick start</Button></Link>
          <TrackList />
          <Link className="m-5" to="/tracks/create"><Button className="m-2" as="span" color="teal" pill >Add new track</Button></Link>
      </main>
  );
}
