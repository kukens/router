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

    const { evaluatedChord, isAnalyzing } = useChord();

    const [trackData, setTrackData] = useState<TrackData>(EmptyTrackData);

    const [iteration, setIteration] = useState<number>(1);
    const [countDownToStart, setCountDownToStart] = useState<number>(3);

    const [isReadyToPlay, setIsReadyToPlay] = useState<boolean>(false);

    const beatsElementsRef = useRef<HTMLDivElement[]>([]);
    const barsElementsRef = useRef<HTMLDivElement[]>([]);
    const animationContainerRef = useRef<HTMLDivElement>(null);
    const animationKeyFramesStyleRef = useRef<HTMLStyleElement>(null)

    const evaluatedChordRef = useRef(evaluatedChord);
    const evaluatedChordVerionsRef = useRef(evaluatedChord?.version);

    const currentBeatIndexRef = useRef(0);
    const beatsToSkip = useRef(0);

    useEffect(() => {
        const trackDataFromLocalStorage = JSON.parse(localStorage.getItem(`trackData-${props.id}`) ?? "") as TrackData;
        console.log('isAnalyzing ' + isAnalyzing)
        setTrackData(trackDataFromLocalStorage)
    }, []);

    useEffect(() => {
        if (isAnalyzing && trackData.bars.length > 0) {

            const id = setInterval(() => {
                setCountDownToStart(prevCount => prevCount - 1)
            }, 1000);

            return () => clearInterval(id);
        }
    }, [isAnalyzing, trackData]);

    useEffect(() => {
        if (countDownToStart == 0) {
            setIsReadyToPlay(true)
        }
    }, [countDownToStart]);

    useEffect(() => {
        if (isReadyToPlay && animationContainerRef.current != null && animationKeyFramesStyleRef.current != null) {

            const timePerBeat = 60 / trackData.tempo * 1000;

            const barsCount = trackData.bars.length;
            const animationSplit = 100 / barsCount;

            let keyframes = "";
            for (let i = 0; i <= barsCount; i++) {
                const keyFrameStep = i == barsCount ? "100%" : `${animationSplit * i}%, ${animationSplit * (i + 1) - (timePerBeat * trackData.beatsPerBar / 1000 / barsCount * 6)}%`
                keyframes += `
                ${keyFrameStep} { transform: translateY(${-i * 76}px); }`;
            }
            animationKeyFramesStyleRef.current.innerHTML = `@keyframes dynamic-step { ${keyframes} }`

            animationContainerRef.current.className = "animate-dynamic-step";
            animationContainerRef.current.style.animationDuration = `${timePerBeat * trackData.beatsPerBar * barsCount}ms`;

            tick(timePerBeat * trackData.beatsPerBar)

            const id = setInterval(() => {
                tick(timePerBeat * trackData.beatsPerBar)
            }, timePerBeat);

            return () => clearInterval(id);
        }
    }, [isReadyToPlay]);

    useEffect(() => {
        console.log('chord changed')
        evaluatedChordRef.current = evaluatedChord;

        const currentIndex = currentBeatIndexRef.current - 1 < 0 ? beatsElementsRef.current.length - 1 : currentBeatIndexRef.current - 1;

        if (evaluatedChordVerionsRef.current != evaluatedChordRef.current?.version) {
            if (beatsElementsRef.current[currentIndex].dataset.chord == evaluatedChordRef.current?.value) {
                beatsElementsRef.current[currentIndex].classList.add("bg-green-800")
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

        if (beatsToSkip.current > 0) {
            console.log('Beats to skip: ' + beatsToSkip.current)
            beatsToSkip.current = beatsToSkip.current - 1
            return;
        }

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

        console.log('currentBeatIndexRef: ' + currentBeatIndexRef.current)

        if (currentBeatIndexRef.current == overallBeatsCount - 1) {
            //beatsToSkip.current = trackData.beatsPerBar;
            setIteration(iteration + 1);
        }
    }

    if (trackData.bars.length == 0) {
        return <></>
    }

    const generateBarsHtml = (bars: Bar[], useFakeBars: boolean, usePlaceholder: boolean) => {

        return (
            bars.map((bar, barIndex) => (
                <div key={barIndex} className={`${usePlaceholder ? "invisible" : ""} bar-wrapper flex items-center`}>
                    <div ref={useFakeBars ? null : registerBars} className={`${styles['bar']} grid grid-cols-${trackData.beatsPerBar} gap-0 w-full p-1`}>

                        {bar.chords.map((beat, beatIndex) => (
                            <div key={beatIndex} ref={useFakeBars ? null : registerBeats} className={`${styles['beat']} ${barIndex == 0 ? "border-t-4 border-gray-400" : ""} ${beatIndex == 0 ? "rounded-l-sm" : ""} ${beatIndex == trackData.beatsPerBar - 1 ? "rounded-r-sm" : ""} h-16 bg-gray-500 p-5 m-px text-center`} data-chord={useFakeBars ? null : beat}>
                                {(beatIndex == 0 || bar.chords[beatIndex - 1] != bar.chords[beatIndex]) && beat.replace("b", "♭").replace("#", "♯")}
                            </div>
                        ))}
                    </div>
                </div>
            ))
        )
    }

    return (
        <div>
            <div className="bars relative overflow-hidden h-57 ">
                <div className="absolute top-5 left-0 right-0 flex justify-center z-20 text-teal">{countDownToStart > 0 ? <p>{countDownToStart}</p> : ""}</div>
                <div className="absolute top-0 inset-x-0 h-18 w-full bg-gradient-to-b from-gray-900 pointer-events-none z-10"></div>
                <style ref={animationKeyFramesStyleRef} />
                <div ref={animationContainerRef}>
                    {generateBarsHtml(trackData.bars.slice(-1), true, iteration == 1)}
                    {generateBarsHtml(trackData.bars, false, false)}
                    {generateBarsHtml(trackData.bars.slice(0, 2), true, false)}
                </div>
                <div className="absolute bottom-0 inset-x-0 h-18 w-full bg-gradient-to-b to-gray-900 pointer-events-none z-10"></div>
            </div>
        </div>
    )
}