'use client'

import { Button } from '@base-ui/react/button';
import { Link } from "react-router";
import { ArrowLeft } from 'lucide-react';
import Jam from "~/components/workOut/WorkOut"


export default function StartChallenge() {

    return (
        <main className="">
            <Link to="/"><Button className="btn-action-back" ><ArrowLeft size={25} /> </Button></Link>

            <Jam />
        </main>
    );
}
