'use client';

import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import styles from '~/components/Start.module.css';

export default function Start() {

    return (
        <>

            <div className={styles.logoWrapper}>

                <svg viewBox="95 3 100 100" className={styles.logoBg} xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="fadeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="white" stop-opacity="1"></stop>
                            <stop offset="60%" stop-color="white" stop-opacity="1"></stop>
                            <stop offset="100%" stop-color="white" stop-opacity="0"></stop>
                        </linearGradient>
                        <mask id="fadeMask">
                            <rect width="200" height="100" fill="url(#fadeGradient)"></rect>
                        </mask>
                    </defs>
                    <g mask="url(#fadeMask)" >
                        <g stroke="#8ab8ba" stroke-width="0.1" style={{display:'none'}}>
                            <line x1="10" y1="35" x2="190" y2="35"></line>
                            <line x1="10" y1="45" x2="190" y2="45"></line>
                            <line x1="10" y1="55" x2="190" y2="55"></line>
                            <line x1="10" y1="65" x2="190" y2="65"></line>
                            <line x1="10" y1="75" x2="190" y2="75"></line>
                        </g>
                        <g fill="#8ab8ba" transform="translate(0, 0)">
                            <ellipse cx="20" cy="45" rx="7" ry="4.8" transform="rotate(-15 20 45)"></ellipse>
                            <ellipse cx="20" cy="55" rx="7" ry="4.8" transform="rotate(-15 20 55)"></ellipse>
                            <ellipse cx="20" cy="65" rx="7" ry="4.8" transform="rotate(-15 20 65)"></ellipse>
                        </g>
                    </g>
                </svg>

                <h1><span className={styles.logoChords}>chords</span><span className={styles.logoTrainer}>trainer</span></h1>
            </div>
            <div className={styles.cards}>
                <Link to="/workout">
                    <div className={`${styles.card}`}>
                        <h2>
                            Workout <ChevronRight color='#8ab8ba' />
                        </h2>
                        <p>Pick your style and start playing.</p>
                    </div>
                </Link>

                <Link to="/chord-tracks">
                    <div className={`${styles.card}`}>
                        <h2>
                            Chord Tracks <ChevronRight color='#8ab8ba' />
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