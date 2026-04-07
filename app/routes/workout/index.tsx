'use client'

import { Button } from '@base-ui/react/button';
import { Link } from "react-router";
import { ArrowLeft } from 'lucide-react';
import WorkOut from "~/components/workOut/WorkOut"
import pageStyles from "~/theme/Page.module.css";

export default function StartChallenge() {

    return (
        <>
        <div className={pageStyles.pageHeader}>
            <Link to="/"><Button className="btn-action-back" ><ArrowLeft size={20} strokeWidth={1.5} /> </Button></Link>
            <h1>Workout</h1>
        </div>
            <WorkOut />
        </>
    );
}
