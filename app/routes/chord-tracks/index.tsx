'use client'

import { Button } from '@base-ui/react/button';
import { default as TrackList } from "~/components/chordTracks/TrackList"
import PageHeader from '~/components/shared/PageHeader';
import { useFadeNavigate } from '~/components/RouteTransition';

export default function StartChallenge() {
    const navigate = useFadeNavigate();

    return (
        <>

        <PageHeader title="Chord Tracks" backLink="/" />
            <TrackList />

            <div><Button className="btn-action" onClick={() => navigate('/chord-tracks/create')}>Add new track</Button></div>

        </>
    );
}
