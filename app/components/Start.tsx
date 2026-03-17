'use client';

import { Link } from 'react-router';
import styles from '~/components/Start.module.css';

export default function Start() {

    return (
        <div className={styles.container}>
            <h1><span className={styles.logoChords}>chords</span><span className={styles.logoTrainer}>trainer</span></h1>

            <div className={styles.cards}>
                <Link to="/workout">
                    <div className={`${styles.card}`}>
                        <h2>
                            Workout
                        </h2>
                        <p>Pick your style and start playing.</p>
                    </div>
                    </Link>

                <Link to="/chord-tracks">
                    <div className={`${styles.card}`}>
                        <h2>
                            Chord Tracks
                        </h2>
                        <p>Build a collection of custom chord sequences and practice them.</p>
                    </div>
                    </Link>

                <div className={`${styles.card}`}>
                    <h2>
                        Learning Path
                    </h2>
                    <p>Follow a structured journey and Level up your skills.</p>
                </div>
            </div>
        </div>
    )
}