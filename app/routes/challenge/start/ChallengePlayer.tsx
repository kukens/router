'use client';

import { useEffect, useRef, useState } from 'react';
import { useChord } from '~/features/audio/ChordContext';

interface ChallengeProps {
    difficulty: string,
    instrument: string
}

export default function challengePlayer(props: ChallengeProps) {

    const { evaluatedChord } = useChord();

    useEffect(() => {
       
    }, []);


    return (
        <div className="bars relative overflow-hidden h-96">
            <p>{props.difficulty}</p>
            <p>{props.instrument}</p>
        </div>
    );
}