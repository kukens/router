//'use client';

//import { useEffect, useRef, useState } from 'react';
//import { useChord } from '~/features/audio/ChordContext';
//import { difficultyLevels, instruments } from '~/components/Jam';
//import { ACCORDION_CHORDS } from '~/data/accordionChords';
//import styles from '~/components/Bars.module.css';
//import type { ChordProgression } from '~/data/accordionChords';
//import { useSwipeable } from 'react-swipeable';

//interface ChallengeProps {
//    difficulty: string,
//    instrument: string
//}

//function shuffleArray<T>(array: T[]): T[] {
//    const shuffled = [...array];

//    for (let i = shuffled.length - 1; i > 0; i--) {
//        const j = Math.floor(Math.random() * (i + 1));
//        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
//    }

//    return shuffled;
//}

//export default function challengePlayer(props: ChallengeProps) {

//    const { evaluatedChord } = useChord();
//    const evaluatedChordRef = useRef(evaluatedChord);
//    const evaluatedChordVerionsRef = useRef(evaluatedChord?.version);
//    const [progression, setProgression] = useState<ChordProgression | null>(null)
//    const [progressionIndex, setProgressionIndex] = useState<number>(0)

//    const tempo = 80;

//    const beatsElementsRef = useRef<HTMLDivElement[]>([]);
//    const barsElementsRef = useRef<HTMLDivElement[]>([]);
//    const progressions = useRef<ChordProgression[]>([]);
//    const indexRef = useRef(0);

//    const handlers = useSwipeable({
//        onSwiped: (eventData) => {
//            console.log(progressionIndex)
//            if (eventData.dir == 'Left' && progressionIndex < progressions.current.length - 1) {
//                setProgressionIndex(progressionIndex + 1)
//            }
//            else if (eventData.dir == 'Right' && progressionIndex > 0) {
//                setProgressionIndex(progressionIndex - 1)
//            }
//        }
//    });

//    useEffect(() => {
//        const accordionChordsFilteredByDifficulty = ACCORDION_CHORDS.filter((x) => x.difficulty == +props.difficulty)[0];
//        progressions.current = shuffleArray(accordionChordsFilteredByDifficulty.progressions)

//        setProgression(progressions.current[progressionIndex]);

//    }, []);

//    useEffect(() => {

//        setProgression(progressions.current[progressionIndex]);

//        indexRef.current = 0;

//        barsElementsRef.current.forEach(bar => {
//            bar.classList.remove(styles.active)
//            bar.style.animationDuration = ``;
//        });

//        beatsElementsRef.current.forEach(beat => {
//            beat.classList.remove(styles.active);
//            beat.classList.remove("bg-green-800");
//        });

//        const timePerBeat = 60 / tempo * 1000;
//        const id = setInterval(() => {
//            tick(timePerBeat * 4)
//        }, timePerBeat);

//        return () => clearInterval(id);

//    }, [progressionIndex]);


//    useEffect(() => {
//        console.log('chord changed')
//        evaluatedChordRef.current = evaluatedChord;

//        const beats = beatsElementsRef.current;
//        const currentIndex = indexRef.current - 1 < 0 ? beats.length - 1 : indexRef.current - 1;

//        if (evaluatedChordVerionsRef.current != evaluatedChordRef.current?.version) {
//            if (beats[currentIndex].dataset.chord == evaluatedChordRef.current?.value) {
//                beats[currentIndex].classList.add("bg-green-800")
//            }
//        }

//        evaluatedChordVerionsRef.current = evaluatedChordRef.current?.version;

//    }, [evaluatedChord]);


//    const registerBeats = (el: HTMLDivElement | null) => {
//        if (el && !beatsElementsRef.current.includes(el)) {
//            beatsElementsRef.current.push(el);
//        }
//    };

//    const registerBars = (el: HTMLDivElement | null) => {
//        if (el && !barsElementsRef.current.includes(el)) {
//            barsElementsRef.current.push(el);
//        }
//    };

//    function tick(timePerBar: number) {


//        const beats = beatsElementsRef.current;
//        const bars = barsElementsRef.current;
//        const currentIndex = indexRef.current;

//        const beatsLength = beatsElementsRef.current.length;
//        const barsLength = bars.length;

//        const currentBar = Math.ceil((currentIndex + 1) / 4) - 1;
//        const previousBar = currentBar == 0 ? barsLength - 1 : currentBar - 1;
//        console.log(currentBar + " " + timePerBar)

//        bars[currentBar].classList.add(styles.active);
//        bars[currentBar].style.animationDuration = `${timePerBar}ms`;

//        if (previousBar != currentBar) {
//            bars[previousBar].classList.remove(styles.active);
//            bars[previousBar].style.animationDuration = "";
//        }

//        const previousBeat = currentIndex == 0 ? beatsLength - 1 : currentIndex - 1;

//        beats[currentIndex].classList.add(styles.active);
//        beats[currentIndex].classList.remove("bg-green-800");
//        beats[previousBeat].classList.remove(styles.active);

//        indexRef.current = (currentIndex + 1) % beatsLength
//    }


//    return (
//        <div className="bars relative overflow-hidden h-96" {...handlers}>
//            <p>Difficulty: {difficultyLevels[props.difficulty]}</p>
//            <p>Instrument: {instruments[props.instrument]}</p>


//            <p>{progression?.name}</p>
//            <p>{progression?.description}</p>
//            <p>{progression?.chords}</p>
//            <p>{progression?.tags.map((x, index) =>
//            (
//                <strong key={index}>{x} </strong>
//            ))}
//            </p>

//            <div className="slider-verticalx">
//                <div className="bar-wrapper flex items-center">
//                    <div ref={registerBars} className={`${styles['bar']} grid grid-cols-4 gap-1 w-full p-1`}>
//                        {progression?.chords.map((chord, j) => (
//                            <div key={j} ref={registerBeats} className={`${styles['beat']} rounded-sm bg-gray-500 p-5 text-center`} data-chord={chord}>
//                                {chord.replace("b", "♭").replace("#", "♯")}
//                            </div>
//                        ))}
//                    </div>
//                </div>

//            </div>

//        </div>
//    );
//}