'use client';

import { useEffect, useRef, useState } from 'react';
import { useChord } from '~/features/audio/ChordContext';
import styles from '~/components/Bars.module.css';

import { EmptyTrackData } from '~/types/TrackData';
import type { TrackData } from '~/types/TrackData';

interface BarProps {
    id: string
}

export default function TrackPlayer(props: BarProps) {

    const { evaluatedChord } = useChord();

    const [trackData, setTrackData] = useState<TrackData>(EmptyTrackData);

    const beatsElementsRef = useRef<HTMLDivElement[]>([]);
    const barsElementsRef = useRef<HTMLDivElement[]>([]);
    const animationContainerRef = useRef<HTMLDivElement>(null);
    const animationKeyFramesStyleRef = useRef<HTMLStyleElement>(null);


    const evaluatedChordRef = useRef(evaluatedChord);
    const evaluatedChordVerionsRef = useRef(evaluatedChord?.version);

    const indexRef = useRef(0);

    useEffect(() => {
        const trackDataFromLocalStorage = JSON.parse(localStorage.getItem(`trackData-${props.id}`) ?? "") as TrackData;

        trackDataFromLocalStorage.bars = [...trackDataFromLocalStorage.bars, ...trackDataFromLocalStorage.bars]

        setTrackData(trackDataFromLocalStorage)

    }, []);

    useEffect(() => {
        if (trackData.bars.length > 0 && animationContainerRef.current != null && animationKeyFramesStyleRef.current != null) {




            const timePerBeat = 60 / trackData.tempo * 1000;
            const timePerBar = trackData.bars.length / 2 * timePerBeat * 4;

            console.log(timePerBeat * 4)
            let isFirstRun = true;

            const animationContainer = animationContainerRef.current;

            let numberOfBars = trackData.bars.length / 2;
            let animationSplit = 100 / numberOfBars;

            console.log(timePerBar)
           let rules = "";
            for (let i = 0; i < numberOfBars; i++) {
                rules += `
                 ${animationSplit * i}%, ${animationSplit * (i + 1) - (timePerBeat * 4 / 1000 / numberOfBars * 3)}% {
                        transform: translateY(-${i * 152/2}px);
                    }
                `;
            }

            animationKeyFramesStyleRef.current.innerHTML = `
                @keyframes dynamic-step {
                    ${rules}
                    100% {
                        transform: translateY(-50%);
                    }
                 }
            `


            const id = setInterval(() => {

                if (isFirstRun) {
                    animationContainer.className = "animate-dynamic-step";
                    animationContainer.style.animationDuration = `${timePerBeat * 4 * numberOfBars}ms`;
                    isFirstRun = false;
                }

                tick(timePerBeat * 4)

            }, timePerBeat);

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

        const beatsLength = beatsElementsRef.current.length / 2;
        const barsLength = barsElementsRef.current.length / 2;

        const currentBar = Math.ceil((indexRef.current + 1) / 4) - 1;
        const previousBar = currentBar == 0 ? barsLength - 1 : currentBar - 1;

        barsElementsRef.current[currentBar].classList.add(styles.active);
        barsElementsRef.current[currentBar].style.animationDuration = `${timePerBar}ms`;

        if (previousBar != currentBar) {
            barsElementsRef.current[previousBar].classList.remove(styles.active);
            barsElementsRef.current[previousBar].style.animationDuration = "";
        }

        const previousBeat = indexRef.current == 0 ? beatsLength - 1 : indexRef.current - 1;

        beatsElementsRef.current[indexRef.current].classList.add(styles.active);
        beatsElementsRef.current[indexRef.current].classList.remove("bg-green-800");
        beatsElementsRef.current[previousBeat].classList.remove(styles.active);

        indexRef.current = (indexRef.current + 1) % beatsLength
    }

    if (trackData.bars.length == 0) {
        return <></>
    }


    return (
        <div className="bars relative overflow-hidden h-38">
            <style ref={animationKeyFramesStyleRef} />
            <div ref={animationContainerRef}>
                {trackData.bars.map((bar, i) => (
                    <div key={i} className="bar-wrapper flex items-center">
                        <div ref={registerBars} className={`${styles['bar']} grid grid-cols-4 gap-0 w-full p-1`}>
                            {bar.chords.map((chord, index) => (
                                <div key={index} ref={registerBeats} className={`${styles['beat']} ${index == 0 ? "rounded-l-sm" : ""} ${index == 3 ? "rounded-r-sm" : ""} bg-gray-500 p-5 m-px text-center`} data-chord={chord}>
                                    {(index == 0 || bar.chords[index - 1] != bar.chords[index]) && chord.replace("b", "♭").replace("#", "♯")}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}