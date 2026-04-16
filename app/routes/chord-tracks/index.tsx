'use client'

import { ArrowLeft } from 'lucide-react';
import { Button } from '@base-ui/react/button';
import { Link } from "react-router";
import { default as TrackList } from "~/components/chordTracks/TrackList"
import pageStyles from "~/theme/Page.module.css";
import PageHeader from '~/components/shared/PageHeader';

export default function StartChallenge() {

    return (
        <>

        <PageHeader title="Chord Tracks" backLink="/" />
            <TrackList />

            <Link to="/chord-tracks/create"><Button className="btn-action">Add new track</Button></Link>

        </>
    );
}
