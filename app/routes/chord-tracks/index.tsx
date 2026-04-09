'use client'

import { ArrowLeft } from 'lucide-react';
import { Button } from '@base-ui/react/button';
import { Link } from "react-router";
import { default as TrackList } from "~/components/chordTracks/TrackList"
import pageStyles from "~/theme/Page.module.css";

export default function StartChallenge() {

    return (
        <>

        <div className={pageStyles.pageHeader}>
            <Link to="/"><Button className="btn-action-back" ><ArrowLeft size={20} strokeWidth={1.5} /> </Button></Link>
            <h1>Chord Tracks</h1>
            <Button className="btn-action-back" style={{visibility: 'hidden'}} ><ArrowLeft size={20} strokeWidth={1.5} /> </Button>
        </div>
            <TrackList />

            <Link to="/chord-tracks/create"><Button className="btn-action">Add new track</Button></Link>

        </>
    );
}
