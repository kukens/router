'use client';

import { Spinner } from "flowbite-react";
import { useEffect, useRef, useState } from 'react';
import { useChord, type ChordValue } from '~/features/audio/ChordContext';
import styles from '~/components/Bars.module.css';

import { EmptyTrackData } from '~/types/TrackData';
import type { Bar, TrackData } from '~/types/TrackData';

interface TrackPlayerProps {
    TrackData: TrackData | null
}


interface BeatHistory {
    index: number;
    startTime: number;
    endTime: number | null;
    chord: string;
    evaluations: ChordValue[];
    isMatched: boolean;
}

export default function TrackPlayer(props: TrackPlayerProps) {

    const { evaluatedChord, isAnalyzing } = useChord();

    const [trackData, setTrackData] = useState(EmptyTrackData);

    const countDownInitialValue = 3;
    const [countDownToStart, setCountDownToStart] = useState(countDownInitialValue);
    const [countDownStarted, setCountDownStarted] = useState(false)

    const [isReadyToPlay, setIsReadyToPlay] = useState(false);

    // accuracy tracking: correct / total for current iteration
    const [correctCount, setCorrectCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
    const dividerRef = useRef<HTMLDivElement>(null);
    const beatsElementsRef = useRef<HTMLDivElement[]>([]);
    const barsElementsRef = useRef<HTMLDivElement[]>([]);
    const animationContainerRef = useRef<HTMLDivElement>(null);
    const animationKeyFramesStyleRef = useRef<HTMLStyleElement>(null)

    const evaluatedChordRef = useRef(evaluatedChord);
    const evaluatedChordVerionsRef = useRef(evaluatedChord?.version);

    const beatsHistory = useRef<Record<number, BeatHistory[]>>({});

    const startTime = useRef<number>(0);

    const iteration = useRef(0);
    const currentBeatIndexRef = useRef(0);
    const currentBarIndexRef = useRef(0);

    const beatsToSkip = useRef(0);

    useEffect(() => {
        if (props.TrackData) {
            setTrackData(props.TrackData)
        }
    }, [props.TrackData]);

    useEffect(() => {
        if (isAnalyzing && trackData.bars.length > 0) {
            setCountDownStarted(true)

            console.log('starting countdown')

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

            const barsCount = trackData.bars.length + 1;
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

            startTime.current = Date.now();
            console.log('start: ' + startTime.current)
            
            tick(timePerBeat * trackData.beatsPerBar)

            const id = setInterval(() => {
                tick(timePerBeat * trackData.beatsPerBar)
            }, timePerBeat);

            return () => clearInterval(id);
        }
    }, [isReadyToPlay]);

    const findMatchingBeatHistory = (chord: ChordValue) => {
        const iterationEntries = Object.entries(beatsHistory.current).sort(([a], [b]) => Number(b) - Number(a));

        for (const [iterationKey, beatRecords] of iterationEntries) {
            for (let i = 0; i < beatRecords.length; i++) {
                const beatStart = beatRecords[i].startTime;
                const beatEnd = beatRecords[i].endTime ?? beatRecords[i + 1]?.startTime ?? Number.POSITIVE_INFINITY;

                const hasOverlap = chord.windowStart < beatEnd && chord.windowEnd >= beatStart;
                if (hasOverlap) {
                    return {
                        iteration: Number(iterationKey),
                        beat: beatRecords[i]
                    };
                }
            }
        }

        return null;
    }

    useEffect(() => {
        evaluatedChordRef.current = evaluatedChord;

        if (!evaluatedChordRef.current) {
            return;
        }

        if (evaluatedChordVerionsRef.current == evaluatedChordRef.current.version) {
            return;
        }

        const matchedBeatHistory = findMatchingBeatHistory(evaluatedChordRef.current);

        
        console.log('evaluatedChord: ' + evaluatedChord?.value + ' ' + evaluatedChord?.windowStart + ' - ' + evaluatedChord?.windowEnd)
       // console.log('matchedBeatHistory beat: ' + matchedBeatHistory?.beat + matchedBeatHistory?.beat.startTime + ' - ' + matchedBeatHistory?.beat.endTime)

        if (!matchedBeatHistory) {
            evaluatedChordVerionsRef.current = evaluatedChordRef.current.version;
            return;
        }

        const { beat, iteration: iter } = matchedBeatHistory;

        beat.evaluations.push(evaluatedChordRef.current);
        beat.isMatched = beat.isMatched || beat.chord === evaluatedChordRef.current.value;

        const matchedBeatElement = beatsElementsRef.current[beat.index];
        if (beat.isMatched && matchedBeatElement) {
            matchedBeatElement.classList.add("bg-green-800");
        }

      //  if (matchedBeatHistory.beat.chord !== beatsHistory.current[iter][(matchedBeatHistory.beat.index-1)].chord) {
          //  console.log(` ${matchedBeatHistory.beat.chord} with ${matchedBeatHistory.beat.chord} at iteration ${iter}, beat index ${matchedBeatHistory.beat.index}, time: ${Date.now() - startTime.current}ms`)
      //  }

        // update accuracy counts only if this is the current iteration
        if (iter === iteration.current) {
            const records = beatsHistory.current[iter] || [];
            const matchedCount = records.filter(r => r.isMatched).length;
            setCorrectCount(matchedCount);
        }

        evaluatedChordVerionsRef.current = evaluatedChordRef.current.version;

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

        if (beatsToSkip.current > 0 && dividerRef.current) {
            barsElementsRef.current[currentBarIndexRef.current].classList.remove(styles.active);

            dividerRef.current.classList.add(styles.active);
            dividerRef.current.style.animationDuration = `${timePerBar}ms`;

            beatsToSkip.current = beatsToSkip.current - 1
            return;
        }

        const tickStart = Date.now();
      //  console.log(`started ${currentBeatIndexRef.current} ${beatsElementsRef.current[currentBeatIndexRef.current].dataset.chord}: ${tickStart}`)

        const previousIterationRecords = beatsHistory.current[iteration.current];
        if (previousIterationRecords && previousIterationRecords.length > 0) {
            previousIterationRecords[previousIterationRecords.length - 1].endTime = tickStart;
        }

        if (currentBeatIndexRef.current == 0) {
            iteration.current = iteration.current + 1;
            beatsHistory.current[iteration.current] = [];

            // new iteration begins, reset accuracy stats
            setCorrectCount(0);
            setTotalCount(0);
        }

        beatsHistory.current[iteration.current].push({
            startTime: tickStart,
            endTime: null,
            chord: beatsElementsRef.current[currentBeatIndexRef.current].dataset.chord || "",
            index: currentBeatIndexRef.current,
            evaluations: [],
            isMatched: false
        })

        // increment total beats for this iteration
        setTotalCount(prev => prev + 1);

        const overallBeatsCount = beatsElementsRef.current.length;

        currentBarIndexRef.current = Math.ceil((currentBeatIndexRef.current + 1) / trackData.beatsPerBar) - 1;
        const previousBarIndex = currentBarIndexRef.current == 0 ? barsElementsRef.current.length - 1 : currentBarIndexRef.current - 1;

        barsElementsRef.current[currentBarIndexRef.current].classList.add(styles.active);
        barsElementsRef.current[currentBarIndexRef.current].style.animationDuration = `${timePerBar}ms`;

        if (previousBarIndex != currentBarIndexRef.current) {
            barsElementsRef.current[previousBarIndex].classList.remove(styles.active);
            barsElementsRef.current[previousBarIndex].style.animationDuration = "";
        }

        const previousBeatIndex = currentBeatIndexRef.current == 0 ? overallBeatsCount - 1 : currentBeatIndexRef.current - 1;

        beatsElementsRef.current[currentBeatIndexRef.current].classList.add(styles.active);
        beatsElementsRef.current[currentBeatIndexRef.current].classList.remove("bg-green-800");
        beatsElementsRef.current[previousBeatIndex].classList.remove(styles.active);

        currentBeatIndexRef.current = (currentBeatIndexRef.current + 1) % overallBeatsCount

        if (currentBeatIndexRef.current == 0) {
            beatsToSkip.current = trackData.beatsPerBar;
        }
    }

    if (trackData.bars.length == 0) {
        return <></>
    }


    const getRef: any = (useFakeBars: boolean, usePlaceholder: boolean) => {
        if (usePlaceholder) {
            return dividerRef;
        }

        if (useFakeBars) {
            return null;
        }

        return registerBars;
    }

    const generateBarsHtml = (bars: Bar[], useFakeBars: boolean, usePlaceholder: boolean) => {

        return (
            bars.map((bar, barIndex) => (
                <div key={barIndex} className={`${usePlaceholder ? "opacity-25" : ""} bar-wrapper flex items-center`}>
                    <div ref={getRef(useFakeBars, usePlaceholder)} className={`${styles['bar']} grid grid-cols-${trackData.beatsPerBar} gap-0 w-full p-1`}>
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

                <div className="absolute top-5 left-0 right-0 flex justify-center z-20 text-teal">
                    {!countDownStarted &&
                        <Spinner aria-label="Default status example" />
                    }
                    {countDownStarted && countDownToStart > 0 ? <p>{countDownToStart}</p> : ""} </div>
                <div className="absolute top-0 inset-x-0 h-18 w-full bg-gradient-to-b from-gray-900 pointer-events-none z-10"></div>
                <style ref={animationKeyFramesStyleRef} />
                <div ref={animationContainerRef}>
                    {generateBarsHtml([{ chords: new Array(trackData.bars[0].chords.length).fill("") }], true, true)}
                    {generateBarsHtml(trackData.bars, false, false)}
                    {generateBarsHtml([{ chords: new Array(trackData.bars[0].chords.length).fill("") }], true, true)}            
                    {generateBarsHtml(trackData.bars.slice(0, 2), true, false)}
                </div>
                <div className="absolute bottom-0 inset-x-0 h-18 w-full bg-gradient-to-b to-gray-900 pointer-events-none z-10"></div>

            </div>

                            <div className="">
                                <p>Accuracy: {correctCount}/{totalCount} ({accuracy}%)</p>
                                <p>Reaction:</p>
                                <p>Fill:</p>
                                </div>
        </div>
    )
}