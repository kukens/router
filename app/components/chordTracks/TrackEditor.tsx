'use client';

import { useEffect, useRef, useState } from "react";
import type { TrackData, Bar } from "~/types/TrackData";
import { Button } from '@base-ui/react/button';
import { Input } from '@base-ui/react/input';
import { EllipsisVertical, Minus, Plus, X } from 'lucide-react';
import TagSelectorDrawer from "~/components/chordTracks/TagSelectorDrawer"
import ChordSelectorDrawer from "~/components/chordTracks/ChordSelectorDrawer"
import styles from "./TrackEditor.module.css";
import BarOptionsDrawer from "./BarOptionsDrawer";
import { Slider } from "@base-ui/react/slider";
import { useFadeNavigate } from "~/components/RouteTransition";

interface TrackEditorProps {
    TrackData: TrackData | null
    Id: string
}

const createBar = (beatsPerBar: number, defaultChord = ''): Bar => ({
    chords: new Array(beatsPerBar).fill(defaultChord),
});

const isBlankBar = (bar: Bar) => bar.chords.every((chord) => chord === '');

const ensureTrailingBlankBar = (bars: Bar[], beatsPerBar: number): Bar[] => {
    if (bars.length === 0) {
        return [createBar(beatsPerBar)];
    }

    const normalizedBars = [...bars];
    const lastBar = normalizedBars[normalizedBars.length - 1];

    if (isBlankBar(lastBar)) {
        return normalizedBars;
    }

    return [...normalizedBars, createBar(beatsPerBar)];
};

const isBarInsideRepeatBlock = (bars: Bar[], barIndex: number) => {
    let isInsideRepeatBlock = false;

    for (let i = 0; i < bars.length; i++) {
        const bar = bars[i];

        if (bar.repeat !== undefined) {
            isInsideRepeatBlock = true;
        }

        if (i === barIndex) {
            return isInsideRepeatBlock || bar.repeatEnd === true;
        }

        if (bar.repeatEnd) {
            isInsideRepeatBlock = false;
        }
    }

    return false;
};

export default function TrackEditor(props: TrackEditorProps) {

    const [trackName, setTrackName] = useState(props.TrackData?.name || "");
    const [beatsPerBar, setBeatsPerBar] = useState(4);
    const [tags, setTags] = useState<string[]>([]);

    const [isChordsDrawerOpen, setIsChordsDrawerOpen] = useState(false);
    const [isTagsDrawerOpen, setIsTagsDrawerOpen] = useState(false);
    const [isBarOptionsDrawerOpen, setIsBarOptionsDrawerOpen] = useState(false);

    const [tempo, setTempo] = useState(props.TrackData?.tempo || 120);
    const [id, setId] = useState(props.Id || crypto.randomUUID());
    const [bars, setBars] = useState<Bar[]>(ensureTrailingBlankBar(props.TrackData?.bars || [], beatsPerBar));
    const [selectedBarIndex, setSelectedBarIndex] = useState(0);
    const [selectedBeatIndex, setSelectedBeatIndex] = useState(0);
    const [selectedChord, setSelectedChord] = useState("");
    const navigate = useFadeNavigate();

    useEffect(() => {
        if (props.TrackData) {
            setBars(ensureTrailingBlankBar(props.TrackData.bars, props.TrackData.beatsPerBar));
            setTrackName(props.TrackData.name)
            setBeatsPerBar(props.TrackData.beatsPerBar)
            setTempo(props.TrackData.tempo)
            setId(props.Id)
            setTags(props.TrackData.tags || [])
        }
    }, [props.TrackData]);

    const updateBeats = (value: number) => {
        if (![3, 4].includes(value)) return;

        setBars((prev) => prev.map((bar) => ({
            ...bar,
            chords: value < bar.chords.length
                ? bar.chords.slice(0, value)
                : [...bar.chords, ...new Array(value - bar.chords.length).fill(isBlankBar(bar) ? '' : '-')],
        })));
        setSelectedBeatIndex((prev) => Math.min(prev, value - 1));
        setBeatsPerBar(value);
    };

    const addBar = (barIndex?: number) => {
        if (barIndex !== undefined) {
            setBars(prev => {
                const newBars = [...prev];
                const currentBar = newBars[barIndex];
                const shouldMoveRepeatEnd = !!currentBar.repeatEnd;

                if (isBlankBar(currentBar)) {
                    const { repeatEnd, ...rest } = currentBar;

                    newBars[barIndex] = {
                        ...rest,
                        chords: new Array(beatsPerBar).fill('-'),
                    };

                    newBars.splice(barIndex + 1, 0, {
                        ...createBar(beatsPerBar),
                        ...(shouldMoveRepeatEnd ? { repeatEnd: true } : {}),
                    });
                    return newBars;
                }

                if (shouldMoveRepeatEnd) {
                    const { repeatEnd, ...rest } = currentBar;
                    newBars[barIndex] = rest;
                }

                const newBar = {
                    ...createBar(beatsPerBar, '-'),
                    ...(shouldMoveRepeatEnd ? { repeatEnd: true } : {}),
                };
                newBars.splice(barIndex + 1, 0, newBar);
                return newBars;
            });
        } else {
            setBars((prev) => [...prev, createBar(beatsPerBar, '-')]);
        }
    };

    const removeBar = (barIndex: number) => {
        setBars(prev => {
            const newBars = [...prev];
            const barToRemove = newBars[barIndex];

            if (barToRemove.repeatEnd && barIndex > 0) {
                newBars[barIndex - 1] = { ...newBars[barIndex - 1], repeatEnd: true };
            }

            if (barToRemove.repeat) {
                for (let i = barIndex + 1; i < newBars.length; i++) {
                    if (newBars[i].repeatEnd) {
                        const { repeatEnd, ...rest } = newBars[i];
                        newBars[i] = rest;
                        break;
                    }
                }
            }

            return ensureTrailingBlankBar(newBars.filter((_, idx) => idx !== barIndex), beatsPerBar);
        });
    };

    const removeTag = (tag: string) => {
        setTags(prev => prev.filter(_ => _ !== tag))
    };

    const saveTrack = () => {
        const now = new Date().toISOString();

        const trackData: TrackData = {
            id: id,
            name: trackName,
            beatsPerBar: beatsPerBar,
            tempo: tempo,
            bars: bars.filter((bar, barIndex) => !(barIndex === bars.length - 1 && isBlankBar(bar))).map((bar) => ({
                repeat: bar.repeat,
                repeatEnd: bar.repeatEnd,
                chords: bar.chords.map((chord) => chord || "-"),
            })),
            tags: tags,
            loop: false,
            createdAt: props.TrackData?.createdAt ?? now,
            modifiedAt: now
        }

        localStorage.setItem(`trackData-${trackData.id}`, JSON.stringify(trackData));
        navigate(`/chord-tracks/${id}`);
    };

    const updateChord = (barIndex: number, beatIndex: number, value: string, fill: boolean) => {

        const isLastBar = barIndex === bars.length - 1;
        const wasLastBarEmpty = bars[barIndex]?.chords.every(c => c === '');

        const updated = [...bars];

        if (fill) {
            updated[barIndex].chords.fill(value, beatIndex, beatsPerBar);
        }
        else {
            updated[barIndex].chords[beatIndex] = value;
        }

        updated[barIndex] = {
            ...updated[barIndex],
            chords: updated[barIndex].chords.map((chord) => chord || '-'),
        };

        if (isLastBar && wasLastBarEmpty) {
            const newBar = createBar(beatsPerBar);
            updated.push(newBar);
        }

        setBars(updated);
    };

    const handleChordSelection = (chordName: string, fill: boolean) => {
        updateChord(selectedBarIndex, selectedBeatIndex, chordName, fill)
        setIsChordsDrawerOpen(false)
    };



    const handleBarOptionSelect = (key: string) => {
        setIsBarOptionsDrawerOpen(false);
        const barIndex = selectedBarIndex;
        const canSetRepeat = !isBarInsideRepeatBlock(bars, barIndex);

        if (key === '1') { // Remove bar
            removeBar(barIndex);
        } else if (key === '2') { // Add bar
            addBar(barIndex);
        } else if (key === '3' && canSetRepeat) { // Open repeat block
            const updated = [...bars];
            if (updated[barIndex]) {
                updated[barIndex] = { ...updated[barIndex], repeat: 1, repeatEnd: true };
                setBars(updated);
            }
        } 
    };

    const updateRepeatCount = (barIndex: number, change: number) => {
        setBars(prev => {
            const newBars = [...prev];
            const bar = newBars[barIndex];
            if (bar && bar.repeat !== undefined) {
                const newRepeat = bar.repeat + change;
                if (newRepeat > 0) {
                    newBars[barIndex] = { ...bar, repeat: newRepeat};
                }

                if (newRepeat === 0) {
                    const { repeat, ...rest } = bar;
                    newBars[barIndex] = rest;

                    // also remove repeatEnd from the next bar that has it
                    for (let i = barIndex; i < newBars.length; i++) {
                        if (newBars[i].repeatEnd) {
                            const { repeatEnd, ...rest } = newBars[i];
                            newBars[i] = rest;
                            break;
                        }
                    }
                }
            }
            return newBars;
        });
    };

    const shouldHideBarOptionsButton = (bar: Bar, barIndex: number) => {
        return barIndex === bars.length - 1 && isBlankBar(bar);
    };

    return (
        <div className={styles.container}>

            <div className={styles.settings}>
                <label className={styles.trackName}>
                    <span>Track name</span>
                    <Input value={trackName} type="text" placeholder="Track name" required onChange={(e) => setTrackName(e.target.value)} />
                </label>
                <div>
                    Beats per Bar
                    <div className="btn-group">
                        <Button className={beatsPerBar === 3 ? "btn-active" : "btn-inactive"} onClick={() => updateBeats(3)}>3</Button>
                        <Button className={beatsPerBar === 4 ? "btn-active" : "btn-inactive"} onClick={() => updateBeats(4)}>4</Button>
                    </div>
                </div>
                <label>Tempo
                        <span className={styles.numberLabel}>{tempo}</span>
             
                        <Slider.Root className={styles.sliderRoot} defaultValue={tempo} onValueChange={(value) => setTempo(value)} max={150} min={40} step={1} >
                            <Slider.Control className={styles.Control}>
                                <Slider.Track className={styles.Track}>
                                <Slider.Indicator className={styles.Indicator} />
                                <Slider.Thumb aria-label="Volume" className={styles.Thumb} />
                                </Slider.Track>
                            </Slider.Control>
                         </Slider.Root>
                </label>

            </div>



            <div className={styles.bars}>
                {bars?.map((bar, barIndex) => (
                    <>
                        {!!bar.repeat && bar.repeat > 0 && (
                            <div className={styles.repeatBlock}>
                               
                                    Repeat
                                    <span className={styles.numberLabel}> <X />{bar.repeat}</span>
                              
                                <div className="btn-group">
                                    <Button className="btn-action-alt" onClick={() => updateRepeatCount(barIndex, -1)}><Minus /></Button>
                                    <Button className="btn-action-alt" onClick={() => updateRepeatCount(barIndex, 1)}><Plus /></Button>
                                </div>
                            </div>
                        )}
                        <div className={`${styles.bar} ${bar.repeatEnd ? styles.repeatEnd : ''}`}>

                          <div className={`${styles.beats}`}>

                                {Array.from({ length: beatsPerBar }).map((_, beatIndex) => (

                                    <Button key={beatIndex} className={`btn-action-alt ${styles.beat} `}
                                        onClick={() => {
                                            setSelectedBarIndex(barIndex)
                                            setSelectedBeatIndex(beatIndex)
                                            setIsChordsDrawerOpen(true)
                                            setSelectedChord(bars[barIndex].chords[beatIndex])
                                        }
                                        }

                                    >{bars[barIndex].chords[beatIndex]?.replace("b", "♭").replace("#", "♯") || ""}</Button>
                                ))}

                            </div>

                            <Button key={barIndex} className={`btn-action-alt ${styles.removeBar}`} style={shouldHideBarOptionsButton(bar, barIndex) ? { visibility: 'hidden' } : undefined} onClick={() => {
                                setSelectedBarIndex(barIndex);
                                setIsBarOptionsDrawerOpen(true);
                            }}>
                                <EllipsisVertical size={18} strokeWidth={1.5} />
                            </Button>
                        </div>
                    </>
                ))}

     
                <BarOptionsDrawer isOpen={isBarOptionsDrawerOpen} canSetRepeat={!isBarInsideRepeatBlock(bars, selectedBarIndex)} handleSelect={handleBarOptionSelect} handleClose={() => setIsBarOptionsDrawerOpen(false)} />
                <ChordSelectorDrawer selectedChord={selectedChord} isOpen={isChordsDrawerOpen} handleClose={() => setIsChordsDrawerOpen(false)} handleSelect={handleChordSelection} />
            </div>

            <div className={styles.tags}>
                <h3>Tags</h3>

                <TagSelectorDrawer isOpen={isTagsDrawerOpen} selectedTags={tags} handleClose={() => setIsTagsDrawerOpen(false)} handleSave={(newTags) => { setTags(newTags); setIsTagsDrawerOpen(false); }} />


                <div className={styles.selectedTags}>
                    {tags?.map((tag, tagIndex) => (
                        <Button key={tagIndex} className={`btn-active`} onClick={() => removeTag(tag)}>
                            {tag}
                            <X size={15} />
                        </Button>
                    ))}
                </div>
            </div>

            <Button onClick={saveTrack} className="btn-action">Save</Button>

        </div>
    );
}
