'use client';

import { useEffect, useRef, useState } from 'react';
import { useSwipeable } from 'react-swipeable';

import styles from '~/components/workOut/WorkOutTrackPlayer.module.css'
import { EmptyTrackData } from '~/types/TrackData';
import type { TrackData } from '~/types/TrackData';
import type { WorkOutTrack } from "~/data/workOutTracks";
import TrackPlayer from '~/components/TrackPlayer';

interface WorkOutTrackProps {
    WorkOutTracks: WorkOutTrack[]
}

const TRACK_TRANSITION_DURATION_MS = 180;

const prefersReducedMotion = () => {
    if (typeof window === 'undefined') {
        return false;
    }

    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export default function WorkOutTrackPlayer(props: WorkOutTrackProps) {

    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [displayedTrackIndex, setDisplayedTrackIndex] = useState(0);
    const [isTrackVisible, setIsTrackVisible] = useState(true);
    const transitionTimeoutRef = useRef<number | null>(null);
    
    const consecutiveSuccessfulIterationsRef = useRef(0);
    
    const workoutTempo = typeof window === 'undefined'
        ? 120
        : (() => {
            const storedTempo = Number(localStorage.getItem('tempo'));
            return storedTempo >= 40 && storedTempo <= 150 ? storedTempo : 120;
        })();

    // Convert all tracks to TrackData once and store in ref
    const convertedTracksRef = useRef(props.WorkOutTracks.map(track => ({
        id: String(track.id),
        name: track.name,
        tags: [],
        tempo: workoutTempo,
        beatsPerBar: 4,
        loop: false,
        bars: track.chords.map(chord => ({
            chords: [chord, chord, chord, chord]
        }))
    })));

    const trackData = (() => {
        const tracks = convertedTracksRef.current;
        return tracks[displayedTrackIndex] ?? tracks[0] ?? EmptyTrackData;
    })();

    useEffect(() => {
        return () => {
            if (transitionTimeoutRef.current !== null) {
                window.clearTimeout(transitionTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        consecutiveSuccessfulIterationsRef.current = 0;

        if (currentTrackIndex === displayedTrackIndex) {
            return;
        }

        if (prefersReducedMotion()) {
            setDisplayedTrackIndex(currentTrackIndex);
            setIsTrackVisible(true);
            return;
        }

        setIsTrackVisible(false);

        if (transitionTimeoutRef.current !== null) {
            window.clearTimeout(transitionTimeoutRef.current);
        }

        transitionTimeoutRef.current = window.setTimeout(() => {
            setDisplayedTrackIndex(currentTrackIndex);
            setIsTrackVisible(true);
            transitionTimeoutRef.current = null;
        }, TRACK_TRANSITION_DURATION_MS);
    }, [currentTrackIndex, displayedTrackIndex]);

    const navigateToTrack = (nextTrackIndex: number) => {
        if (nextTrackIndex === currentTrackIndex) {
            return;
        }

        consecutiveSuccessfulIterationsRef.current = 0;
        setCurrentTrackIndex(nextTrackIndex);
    };

    const goToNextTrack = () => {
        const nextTrackIndex = currentTrackIndex < props.WorkOutTracks.length - 1 ? currentTrackIndex + 1 : 0;
        navigateToTrack(nextTrackIndex);
    };

    const goToPreviousTrack = () => {
        const nextTrackIndex = currentTrackIndex > 0 ? currentTrackIndex - 1 : props.WorkOutTracks.length - 1;
        navigateToTrack(nextTrackIndex);
    };

    const handleIterationComplete = (isSuccessful: boolean) => {
        if (!isSuccessful) {
            consecutiveSuccessfulIterationsRef.current = 0;
            return;
        }

        consecutiveSuccessfulIterationsRef.current += 1;

        const storedThreshold = Number(localStorage.getItem('successful_tries'));
        const threshold = storedThreshold > 0 ? storedThreshold : 3;

        if (consecutiveSuccessfulIterationsRef.current >= threshold) {
            consecutiveSuccessfulIterationsRef.current = 0;
            goToNextTrack();
        }
    };

    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => goToNextTrack(),
        onSwipedRight: () => goToPreviousTrack(),
        trackMouse: true,
        preventScrollOnSwipe: true,
        delta: 50,
    });

    return (
        <>
            <div {...swipeHandlers} className={`${styles.trackContent} ${styles.trackFadeReady} ${isTrackVisible ? styles.trackFadeIn : styles.trackFadeOut}`}>
                <div className={styles.title}>
                    <h2>{trackData.name}</h2>

                    {trackData && (
                        <div className={styles.chords}>
                            {trackData.bars.map((bar, index) => (
                                <span className={styles.chord} key={index}>{bar.chords[0]}</span>
                            ))}
                        </div>
                    )}
                </div>

                <TrackPlayer key={trackData.id} TrackData={trackData} onIterationComplete={handleIterationComplete} />

                <div className={styles.footer}>
                    <p>Playing {displayedTrackIndex + 1} from {props.WorkOutTracks.length} tracks</p>
                </div>
            </div>
        </>
    )
}