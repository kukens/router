'use client';

import { useEffect, useRef, useState } from 'react';
import { useChord } from '~/features/audio/ChordContext';
import styles from '~/components/Bars.module.css';

import { EmptyTrackData } from '~/types/TrackData';
import type { Bar, TrackData } from '~/types/TrackData';

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

        setTrackData(trackDataFromLocalStorage)
    }, []);

    useEffect(() => {
        if (trackData.bars.length > 0 && animationContainerRef.current != null && animationKeyFramesStyleRef.current != null) {

            const timePerBeat = 60 / trackData.tempo * 1000;

            console.log(timePerBeat * trackData.beatsPerBar)
            let isFirstRun = true;

            const animationContainer = animationContainerRef.current;

            let barsCount = trackData.bars.length;
            let animationSplit = 100 / barsCount;

            let keyframes = "";
            for (let i = 0; i <= barsCount; i++) {

                const keyFrameStep = i == barsCount ? "100%"
                    : `${animationSplit * i}%, ${animationSplit * (i + 1) - (timePerBeat * trackData.beatsPerBar / 1000 / barsCount * 10)}%`

                keyframes += `
                 ${keyFrameStep}{
                        transform: translateY(${-i * 76}px);
                    }
                `;
            }

            animationKeyFramesStyleRef.current.innerHTML = `
                @keyframes dynamic-step {
                    ${keyframes}
                 }
            `
            const id = setInterval(() => {

                if (isFirstRun) {
                    animationContainer.className = "animate-dynamic-step";
                    animationContainer.style.animationDuration = `${timePerBeat * trackData.beatsPerBar * barsCount}ms`;
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

        const overallBeatsCount = beatsElementsRef.current.length;
        const barsCount = barsElementsRef.current.length;

        const currentBar = Math.ceil((currentBeatIndexRef.current + 1) / trackData.beatsPerBar) - 1;
        const previousBar = currentBar == 0 ? barsCount - 1 : currentBar - 1;

        barsElementsRef.current[currentBar].classList.add(styles.active);
        barsElementsRef.current[currentBar].style.animationDuration = `${timePerBar}ms`;

        if (previousBar != currentBar) {
            barsElementsRef.current[previousBar].classList.remove(styles.active);
            barsElementsRef.current[previousBar].style.animationDuration = "";
        }

        const previousBeatIndex = currentBeatIndexRef.current == 0 ? overallBeatsCount - 1 : currentBeatIndexRef.current - 1;

        beatsElementsRef.current[currentBeatIndexRef.current].classList.add(styles.active);
        beatsElementsRef.current[currentBeatIndexRef.current].classList.remove("bg-green-800");
        beatsElementsRef.current[previousBeatIndex].classList.remove(styles.active);

        currentBeatIndexRef.current = (currentBeatIndexRef.current + 1) % overallBeatsCount

        if (currentBeatIndexRef.current == overallBeatsCount - 1) {
            setIteration(iteration + 1);
        }
    }

    if (trackData.bars.length == 0) {
        return <></>
    }


    const generateBarsHtml = (bars: Bar[], areFakeBars: boolean, usePlaceholder: boolean) => {

        return (
            bars.map((bar, barIndex) => (
                <div key={barIndex} className={`${usePlaceholder ? "invisible" : ""} bar-wrapper flex items-center`}>
                    <div ref={areFakeBars ? null : registerBars} className={`${styles['bar']} grid grid-cols-${trackData.beatsPerBar} gap-0 w-full p-1`}>

                        {bar.chords.map((beat, beatIndex) => (
                            <div key={beatIndex} ref={areFakeBars ? null : registerBeats} className={`${styles['beat']} ${beatIndex == 0 ? "rounded-l-sm" : ""} ${beatIndex == trackData.beatsPerBar - 1 ? "rounded-r-sm" : ""} bg-gray-500 p-5 m-px text-center`} data-chord={areFakeBars ? null : beat}>
                                {(beatIndex == 0 || bar.chords[beatIndex - 1] != bar.chords[beatIndex]) && beat.replace("b", "♭").replace("#", "♯")}
                            </div>
                        ))}
                    </div>
                </div>
            ))
        )
    }

    return (
        <div className="bars relative overflow-hidden h-57">
            <style ref={animationKeyFramesStyleRef} />
            <div ref={animationContainerRef}>
                {generateBarsHtml(trackData.bars.slice(-1), true, iteration == 1)}
                {generateBarsHtml(trackData.bars, false, false)}
                {generateBarsHtml(trackData.bars.slice(0, 2), true, false)}
            </div>
        </div>
    )
}