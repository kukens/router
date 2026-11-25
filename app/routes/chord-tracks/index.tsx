'use client'

import { Button } from '@base-ui/react/button';
import { default as TrackList } from "~/components/chordTracks/TrackList"
import PageHeader from '~/components/shared/PageHeader';
import { useFadeNavigate } from '~/components/RouteTransition';
import { Plus } from 'lucide-react';

export default function StartChallenge() {
    const navigate = useFadeNavigate();

    return (
        <>

        <PageHeader title="Chord Tracks" backLink="/" />
            <TrackList />

            <div><Button className="btn-action btn-txt-icon" onClick={() => navigate('/chord-tracks/create')}><Plus size={16} />Add new track</Button></div>

        </>
    );
}
