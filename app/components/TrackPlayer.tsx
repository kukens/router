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


interface BeatData {
    index: number;
    startTime: number;
    endTime: number | null;
    chord: string;
    evaluations: ChordValue[];
    isMatched: boolean;
    chordSwitchReactionTime?: number;
}

export default function TrackPlayer(props: TrackPlayerProps) {

    const { evaluatedChord, isAnalyzing } = useChord();

    const [trackData, setTrackData] = useState(EmptyTrackData);

    const countDownInitialValue = 3;
    const [countDownToStart, setCountDownToStart] = useState(countDownInitialValue);
    const [countDownStarted, setCountDownStarted] = useState(false)

    const [isReadyToPlay, setIsReadyToPlay] = useState(false);

    const [correctCount, setCorrectCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    const [avgReactionTime, setAvgReactionTime] = useState<number | null>(null);

    const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

    const reactionPositionPercent = (() => {
        const range = 1000; // -500 .. 500 ms
        const min = -500;
        if (avgReactionTime == null) return 50;
        const clamped = Math.max(min, Math.min(500, avgReactionTime));
        return ((clamped - min) / range) * 100;
    })();

    const dividerRef = useRef<HTMLDivElement>(null);
    const beatsElementsRef = useRef<HTMLDivElement[]>([]);
    const barsElementsRef = useRef<HTMLDivElement[]>([]);
    const animationContainerRef = useRef<HTMLDivElement>(null);
    const animationKeyFramesStyleRef = useRef<HTMLStyleElement>(null)

    const beatsHistory = useRef<Record<number, BeatData[]>>({});

    const startTimeRef = useRef<number>(0);

    const iterationRef = useRef(0);
    const currentBeatIndexRef = useRef(0);
    const currentBarIndexRef = useRef(0);

    const beatsToSkipRef = useRef(0);

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

            startTimeRef.current = Date.now();
            console.log('start: ' + startTimeRef.current)

            tick(timePerBeat * trackData.beatsPerBar)

            const id = setInterval(() => {
                tick(timePerBeat * trackData.beatsPerBar)
            }, timePerBeat);

            return () => clearInterval(id);
        }
    }, [isReadyToPlay]);

    const findMatchingBeatFromBeatsHistory = (chord: ChordValue) => {
        const iterationEntries = Object.entries(beatsHistory.current).sort(([a], [b]) => Number(b) - Number(a));

        for (const [iterationKey, beatRecords] of iterationEntries) {
            for (let i = 0; i < beatRecords.length; i++) {
                const beatStart = beatRecords[i].startTime;
                const beatEnd = beatRecords[i].endTime ?? beatRecords[i + 1]?.startTime ?? Number.POSITIVE_INFINITY;

                const hasOverlap = chord.windowStart < beatEnd && chord.windowEnd >= beatStart;
                if (hasOverlap) {
                    return {
                        iteration: Number(iterationKey),
                        matchingBeatData: beatRecords[i]
                    };
                }
            }
        }

        return null;
    }

    const computeAverageReaction = (iteration?: number) => {
        const iterNum = iteration ?? iterationRef.current;
        const records = beatsHistory.current[iterNum] || [];

        let sum = 0;
        let count = 0;

        for (const b of records) {
            if (b.chordSwitchReactionTime != null) {
                sum += b.chordSwitchReactionTime;
                count++;
            }
        }

        if (count === 0) {
            setAvgReactionTime(null);
        } else {
            setAvgReactionTime(Math.round(sum / count));
        }
    }

    useEffect(() => {

        if (!evaluatedChord) {
            return;
        }

        console.log('evaluatedChords: ' + evaluatedChord?.chords + ' ' + evaluatedChord?.windowStart + ' - ' + evaluatedChord?.windowEnd)

        const matchingBeatRecord = findMatchingBeatFromBeatsHistory(evaluatedChord);

        if (!matchingBeatRecord) {
            return;
        }

        const { matchingBeatData: beatData, iteration } = matchingBeatRecord;

        beatData.evaluations.push(evaluatedChord);
        beatData.isMatched = beatData.isMatched || evaluatedChord.chords.includes(beatData.chord);

        const chordSwitched = matchingBeatRecord.matchingBeatData.chord !== beatsHistory.current[iteration][(matchingBeatRecord.matchingBeatData.index - 1)]?.chord;

        if (chordSwitched && matchingBeatRecord.matchingBeatData.chordSwitchReactionTime == null && beatData.isMatched) {

            const prevBeat = beatsHistory.current[iteration][(matchingBeatRecord.matchingBeatData.index - 1)];

            if (prevBeat) {
                const last3 = prevBeat.evaluations.slice(- (Math.round(prevBeat.evaluations.length / 2)));
                const firstRecognized = last3.find(evaluation => evaluation.chords.includes(matchingBeatRecord.matchingBeatData.chord));

                if (firstRecognized) {
                    matchingBeatRecord.matchingBeatData.chordSwitchReactionTime = firstRecognized.windowStart - beatData.startTime;
                    console.log(`negative chord switch reaction time: ${matchingBeatRecord.matchingBeatData.chordSwitchReactionTime}ms for beat index ${beatData.index} at iteration ${iteration}`)
                }
            }

            matchingBeatRecord.matchingBeatData.chordSwitchReactionTime ??= evaluatedChord.windowStart - beatData.startTime;
            console.log(`chord switch reaction time: ${matchingBeatRecord.matchingBeatData.chordSwitchReactionTime}ms for beat index ${beatData.index} at iteration ${iteration}`)

        }

        const matchedBeatElement = beatsElementsRef.current[beatData.index];

        if (beatData.isMatched && matchedBeatElement) {
            let reactionClass = "bg-green-800";
            if (beatData.chordSwitchReactionTime != null) {
                if (beatData.chordSwitchReactionTime < 100 && beatData.chordSwitchReactionTime > -100) reactionClass = "bg-green-800";
                else if (beatData.chordSwitchReactionTime < 200 && beatData.chordSwitchReactionTime > -200) reactionClass = "bg-green-700";
                else if (beatData.chordSwitchReactionTime < 300 && beatData.chordSwitchReactionTime > -300) reactionClass = "bg-green-600";
                else if (beatData.chordSwitchReactionTime < 400 && beatData.chordSwitchReactionTime > -400) reactionClass = "bg-green-500";
            }
            matchedBeatElement.classList.add(reactionClass);
        }

        // update accuracy counts only if this is the current iteration
        if (iteration === iterationRef.current) {
            const records = beatsHistory.current[iteration] || [];
            const matchedCount = records.filter(r => r.isMatched).length;
            setCorrectCount(matchedCount);
            computeAverageReaction(iteration);
        }

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

    const clearBeatReactionClasses = () => {
        const toRemovePrefix = 'bg-green-';
        for (const el of beatsElementsRef.current) {
            if (!el) continue;
            const classes = Array.from(el.classList);
            for (const c of classes) {
                if (c.startsWith(toRemovePrefix)) {
                    el.classList.remove(c);
                }
            }
        }
    };

    function tick(timePerBar: number) {

        if (beatsToSkipRef.current > 0 && dividerRef.current) {
            barsElementsRef.current[currentBarIndexRef.current].classList.remove(styles.active);

            dividerRef.current.classList.add(styles.active);
            dividerRef.current.style.animationDuration = `${timePerBar}ms`;

            beatsToSkipRef.current = beatsToSkipRef.current - 1
            return;
        }

        const tickStart = Date.now();
        //  console.log(`started ${currentBeatIndexRef.current} ${beatsElementsRef.current[currentBeatIndexRef.current].dataset.chord}: ${tickStart}`)

        const previousIterationRecords = beatsHistory.current[iterationRef.current];
        if (previousIterationRecords && previousIterationRecords.length > 0) {
            previousIterationRecords[previousIterationRecords.length - 1].endTime = tickStart;
        }

        if (currentBeatIndexRef.current == 0) {
            iterationRef.current = iterationRef.current + 1;
            beatsHistory.current[iterationRef.current] = [];

            // new iteration begins, reset accuracy stats and reaction counter
            setCorrectCount(0);
            setTotalCount(0);
            setAvgReactionTime(null);
            clearBeatReactionClasses();
        }

        beatsHistory.current[iterationRef.current].push({
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
            beatsToSkipRef.current = trackData.beatsPerBar;
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
                <div className="mb-2">
                    <p className="mb-1">Accuracy: ({accuracy}%)</p>
                    <div className="relative w-full max-w-xl h-4 rounded overflow-hidden" style={{background: 'linear-gradient(90deg, #e53e3e 0%, #16a34a 100%)'}}>
                        <div className="absolute top-0 h-4" style={{width: '6px', background: 'white', left: `calc(${accuracy}% - 3px)`}} />
                    </div>
                </div>
                <div className="mt-2">
                    <p className="mb-1">Reaction: {avgReactionTime !== null ? `${avgReactionTime} ms` : '-'}</p>
                    <div className="relative w-full max-w-xl h-4 rounded overflow-hidden" style={{background: 'linear-gradient(90deg, #e53e3e 0%, #16a34a 50%, #e53e3e 100%)'}}>
                        <div className="absolute top-0 h-4 w-0.5 bg-white" style={{left: `calc(${reactionPositionPercent}% - 1px)`}} />
                    </div>
                </div>
            </div>
        </div>
    )
}