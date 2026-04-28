'use client';

import { ChevronRight } from 'lucide-react';
import { Button } from '@base-ui/react/button';
import { useFadeNavigate } from '~/components/RouteTransition';
import styles from '~/components/Start.module.css';

export default function Start() {
    const navigate = useFadeNavigate();

    return (
        <>

            <div className={styles.logoWrapper}>

                <h1><span className={styles.logoChords}>chords</span><span className={styles.logoTrainer}>arena</span></h1>
            </div>
            <div className={styles.cards}>
                <Button className={`${styles.card} ${styles.first}`} onClick={() => navigate('/workout')}>
                    <h2>
                        Workout <ChevronRight  />
                    </h2>
                    <p>Pick your chords and style and take the challenge.</p>
                </Button>

                <Button className={`${styles.card}`} onClick={() => navigate('/chord-tracks')}>
                    <h2>
                        Chord Tracks <ChevronRight />
                    </h2>
                    <p>Build a collection of custom chord sequences and practice them.</p>
                </Button>

                <div className={`${styles.card}`} style={{ display: 'none' }}>
                    <h2>
                        Learning Path
                    </h2>
                    <p>Follow a structured journey and Level up your skills.</p>
                </div>
            </div>
        </>
    )
}