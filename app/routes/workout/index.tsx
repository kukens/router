'use client'

import { Button } from '@base-ui/react/button';
import { Link } from "react-router";
import { ArrowLeft } from 'lucide-react';
import WorkOut from "~/components/workOut/WorkOut"
import pageStyles from "~/theme/Page.module.css";
import PageHeader from '~/components/shared/PageHeader';

export default function StartChallenge() {

    return (
        <>
        <PageHeader title="Workout" backLink="/" />
            <WorkOut />
        </>
    );
}
