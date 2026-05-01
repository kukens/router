'use client'

import { Button } from '@base-ui/react/button';
import WorkOut from "~/components/workOut/WorkOut"
import PageHeader from '~/components/shared/PageHeader';

export default function StartChallenge() {

    return (
        <>
        <PageHeader title="Workout" backLink="/" />
            <WorkOut />
        </>
    );
}
