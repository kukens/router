'use client';

import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import styles from '~/components/Start.module.css';

export default function Start() {

    return (
        <>

            <div className={styles.logoWrapper}>

                <svg viewBox="95 3 100 100" className={styles.logoBg} xmlns="http://www.w3.org/2000/svg">
                        <g transform="translate(0, 0)">
                            <ellipse cx="20" cy="45" rx="7" ry="4.8" transform="rotate(-15 20 45)"></ellipse>
                            <ellipse cx="20" cy="55" rx="7" ry="4.8" transform="rotate(-15 20 55)"></ellipse>
                            <ellipse cx="20" cy="65" rx="7" ry="4.8" transform="rotate(-15 20 65)"></ellipse>
                        </g>
                </svg>

                <h1><span className={styles.logoChords}>chords</span><span className={styles.logoTrainer}>arena</span></h1>
            </div>
            <div className={styles.cards}>
                <Link to="/workout">
                    <div className={`${styles.card}`}>
                        <h2>
                            Workout <ChevronRight color='#b0cdce' />
                        </h2>
                        <p>Pick your style and start playing.</p>
                    </div>
                </Link>

                <Link to="/chord-tracks">
                    <div className={`${styles.card}`}>
                        <h2>
                            Chord Tracks <ChevronRight color='#b0cdce' />
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