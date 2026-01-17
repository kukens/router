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

    const [iteration, setIteration] = useState<number>(1);

    const beatsElementsRef = useRef<HTMLDivElement[]>([]);
    const barsElementsRef = useRef<HTMLDivElement[]>([]);
    const animationContainerRef = useRef<HTMLDivElement>(null);
    const animationKeyFramesStyleRef = useRef<HTMLStyleElement>(null)

    const evaluatedChordRef = useRef(evaluatedChord);
    const evaluatedChordVerionsRef = useRef(evaluatedChord?.version);

    const currentBeatIndexRef = useRef(0);

    useEffect(() => {
        const trackDataFromLocalStorage = JSON.parse(localStorage.getItem(`trackData-${props.id}`) ?? "") as TrackData;

        trackDataFromLocalStorage.bars = [...trackDataFromLocalStorage.bars, ...trackDataFromLocalStorage.bars]

        setTrackData(trackDataFromLocalStorage)

    }, []);

    useEffect(() => {
        if (trackData.bars.length > 0 && animationContainerRef.current != null && animationKeyFramesStyleRef.current != null) {

            const timePerBeat = 60 / trackData.tempo * 1000;

            console.log(timePerBeat * trackData.beatsPerBar)
            let isFirstRun = true;

            const animationContainer = animationContainerRef.current;

            let realNumberOfBars = trackData.bars.length / 2;
            let animationSplit = 100 / realNumberOfBars;

            let rules = "";
            for (let i = 0; i < realNumberOfBars; i++) {
                rules += `
                 ${animationSplit * i}%, ${animationSplit * (i + 1) - (timePerBeat * trackData.beatsPerBar / 1000 / realNumberOfBars * 10)}% {
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
                    animationContainer.style.animationDuration = `${timePerBeat * trackData.beatsPerBar * realNumberOfBars}ms`;
                    isFirstRun = false;
                }

                tick(timePerBeat * trackData.beatsPerBar)

            }, timePerBeat);

            return () => clearInterval(id);

        }
    }, [trackData]);

    useEffect(() => {
        console.log('chord changed')
        evaluatedChordRef.current = evaluatedChord;

        const beats = beatsElementsRef.current;
        const currentIndex = currentBeatIndexRef.current - 1 < 0 ? beats.length - 1 : currentBeatIndexRef.current - 1;

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

        const realBeatsCount = beatsElementsRef.current.length / 2;
        const realBarsLength = barsElementsRef.current.length / 2;

        const currentBar = Math.ceil((currentBeatIndexRef.current + 1) / trackData.beatsPerBar) - 1;
        const previousBar = currentBar == 0 ? realBarsLength - 1 : currentBar - 1;

        barsElementsRef.current[currentBar].classList.add(styles.active);
        barsElementsRef.current[currentBar].style.animationDuration = `${timePerBar}ms`;

        if (previousBar != currentBar) {
            barsElementsRef.current[previousBar].classList.remove(styles.active);
            barsElementsRef.current[previousBar].style.animationDuration = "";
        }

        const previousBeatIndex = currentBeatIndexRef.current == 0 ? realBeatsCount - 1 : currentBeatIndexRef.current - 1;

        beatsElementsRef.current[currentBeatIndexRef.current].classList.add(styles.active);
        beatsElementsRef.current[currentBeatIndexRef.current].classList.remove("bg-green-800");
        beatsElementsRef.current[previousBeatIndex].classList.remove(styles.active);



        currentBeatIndexRef.current = (currentBeatIndexRef.current + 1) % realBeatsCount

        if (currentBeatIndexRef.current == realBeatsCount -1) {
            setIteration(iteration + 1);
        }
    }

    if (trackData.bars.length == 0) {
        return <></>
    }


    return (
        <div className="bars relative overflow-hidden h-57">
            <style ref={animationKeyFramesStyleRef} />
            <div ref={animationContainerRef}>
                {trackData.bars.map((bar, barIndex) => (
                    <div key={barIndex} className={`${barIndex == 0 && iteration == 1 ? "" : ""} bar-wrapper flex items-center`}>
                        <div ref={registerBars} className={`${styles['bar']} grid grid-cols-${trackData.beatsPerBar} gap-0 w-full p-1`}>
                        
                            {bar.chords.map((beat, beatIndex) => (
                                <div key={beatIndex} ref={registerBeats} className={`${styles['beat']} ${beatIndex == 0 ? "rounded-l-sm" : ""} ${beatIndex == trackData.beatsPerBar - 1 ? "rounded-r-sm" : ""} bg-gray-500 p-5 m-px text-center`} data-chord={beat}>
                                    {(beatIndex == 0 || bar.chords[beatIndex - 1] != bar.chords[beatIndex]) && beat.replace("b", "♭").replace("#", "♯")}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}