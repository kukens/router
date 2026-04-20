'use client';

import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import styles from '~/components/Start.module.css';

export default function Start() {

    return (
        <>

            <div className={styles.logoWrapper}>

                <h1><span className={styles.logoChords}>chords</span><span className={styles.logoTrainer}>arena</span></h1>
            </div>
            <div className={styles.cards}>
                <Link to="/workout">
                    <div className={`${styles.card} ${styles.first}`}>
                        <h2>
                            Workout <ChevronRight  />
                        </h2>
                        <p>Pick your chords and style and take the challenge.</p>
                    </div>
                </Link>

                <Link to="/chord-tracks">
                    <div className={`${styles.card} ${styles.last}`}>
                        <h2>
                            Chord Tracks <ChevronRight />
                        </h2>
                        <p>Build a collection of custom chord sequences and practice them.</p>
                    </div>
                </Link>

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