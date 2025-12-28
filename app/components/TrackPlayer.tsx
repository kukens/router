'use client';

import { useEffect, useRef, useState } from 'react';
import { useChord } from '~/features/audio/ChordContext';
import styles from '~/components/Bars.module.css';

import type { TrackData } from '~/types/TrackData';

interface BarProps {
    id: string
}

export default function TrackPlayer(props: BarProps) {

    const { evaluatedChord } = useChord();

    const [trackData, setTrackData] = useState<TrackData | null>(null);

    const beatsElementsRef = useRef<HTMLDivElement[]>([]);
    const barsElementsRef = useRef<HTMLDivElement[]>([]);
    const evaluatedChordRef = useRef(evaluatedChord);
    const evaluatedChordVerionsRef = useRef(evaluatedChord?.version);

    const indexRef = useRef(0);

    useEffect(() => {
        const trackDataFromLocalStorage = JSON.parse(localStorage.getItem(`trackData-${props.id}`) ?? "") as TrackData;
        setTrackData(trackDataFromLocalStorage)
    }, []);

    useEffect(() => {
        if (trackData != null) {
            const timePerBeat = 60 / trackData.tempo * 1000;
            const id = setInterval(() => {
                tick(timePerBeat * 4)
            },
                timePerBeat);

            return () => clearInterval(id);
        }
    }, [trackData]);

    useEffect(() => {
        console.log('chord changed')
        evaluatedChordRef.current = evaluatedChord;

        const beats = beatsElementsRef.current;
        const currentIndex = indexRef.current - 1 < 0 ? beats.length - 1 : indexRef.current - 1;

        if (evaluatedChordVerionsRef.current != evaluatedChordRef.current?.version) {
            if (beats[currentIndex].dataset.chord == evaluatedChordRef.current?.value) {
                beats[currentIndex].classList.add("bg-green-800")
            }
        }

        evaluatedChordVerionsRef.current = evaluatedChordRef.current?.version;

    }, [evaluatedChord]);

    const registerBeats = (el: HTMLDivElement | null) => {
        if (el && !beatsElementsRef.current.includes(el)) {
            beatsElementsRef.current.push(el);
        }
    };

    const registerBars = (el: HTMLDivElement | null) => {
        if (el && !barsElementsRef.current.includes(el)) {
            barsElementsRef.current.push(el);
        }
    };

    function tick(timePerBar: number) {


        const beats = beatsElementsRef.current;
        const bars = barsElementsRef.current;
        const currentIndex = indexRef.current;

        const beatsLength = beatsElementsRef.current.length;
        const barsLength = bars.length;

        const currentBar = Math.ceil((currentIndex + 1) / 4) - 1;
        const previousBar = currentBar == 0 ? barsLength - 1 : currentBar - 1;

        bars[currentBar].classList.add(styles.active);
        bars[currentBar].style.animationDuration = `${timePerBar}ms`;
        if (previousBar != currentBar) {
            bars[previousBar].classList.remove(styles.active);
            bars[previousBar].style.animationDuration = "";
        }

        const previousBeat = currentIndex == 0 ? beatsLength - 1 : currentIndex - 1;
        beats[currentIndex].classList.add(styles.active);
        beats[currentIndex].classList.remove("bg-green-800");
        beats[previousBeat].classList.remove(styles.active);

        indexRef.current = (currentIndex + 1) % beatsLength
    }

    return (
        <div className="bars relative overflow-hidden h-96">
            <div className="slider-verticalx">
                {trackData?.bars.map((bar, i) => (
                    <div key={i} className="bar-wrapper flex items-center">
                        <div ref={registerBars} className={`${styles['bar']} grid grid-cols-4 gap-1 w-full p-1`}>
                            {bar.chords.map((chord, j) => (
                                <div key={j} ref={registerBeats} className={`${styles['beat']} rounded-sm bg-gray-500 p-5 text-center`} data-chord={chord}>
                                    {chord}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}