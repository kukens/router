'use client'

import { Button } from "flowbite-react";
import Challenge from "./Challenge"
import { Link } from "react-router";


export default function StartChallenge() {


  return (
    <main className="">
      <Link className="m-5" to="/challenge"><Button className="m-5 mb-10" as="span" color="teal" pill> ← Go Back</Button></Link>

      <Challenge />
    </main>
  );
}
