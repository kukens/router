'use client';

import { useEffect, useRef, useState } from "react";
import type { TrackData, Bar } from "~/types/TrackData";
import { Button } from '@base-ui/react/button';
import { Input } from '@base-ui/react/input';
import { Trash2, X, Trash } from 'lucide-react';
import TagSelectorDrawer from "~/components/chordTracks/TagSelectorDrawer"
import ChordSelectorDrawer from "~/components/chordTracks/ChordSelectorDrawer"
import { useNavigate } from "react-router";
import styles from "./TrackEditor.module.css";

interface TrackEditorProps {
    TrackData: TrackData | null
    Id: string
}

export default function TrackEditor(props: TrackEditorProps) {

    const [trackName, setTrackName] = useState(props.TrackData?.name || "");
    const [beatsPerBar, setBeatsPerBar] = useState(4);
    const [tags, setTags] = useState<string[]>([]);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isTagsDrawerOpen, setIsTagsDrawerOpen] = useState(false);

    const [tempo, setTempo] = useState(props.TrackData?.tempo || 120);
    const [id, setId] = useState(props.Id || crypto.randomUUID());
    const [bars, setBars] = useState<Bar[]>(props.TrackData?.bars || [{ chords: new Array(beatsPerBar).fill('') }]);
    const [selectedBarIndex, setSelectedBarIndex] = useState(0);
    const [selectedBeatIndex, setSelectedBeatIndex] = useState(0);
    const [selectedChord, setSelectedChord] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (props.TrackData) {
            setBars(props.TrackData.bars);
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
                : [...bar.chords, ...new Array(value - bar.chords.length).fill('')],
        })));
        setSelectedBeatIndex((prev) => Math.min(prev, value - 1));
        setBeatsPerBar(value);
    };

    const addBar = () => {
        setBars((prev) => [...prev, { chords: new Array(beatsPerBar).fill('') }]);
    };

    const removeBar = (barIndex: number) => {
        setBars(prev => prev.filter((_, idx) => idx !== barIndex))
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
            bars: bars.map((bar) => ({
                ...bar,
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

        const updated = [...bars];

        if (fill) {
            updated[barIndex].chords.fill(value, beatIndex, beatsPerBar);
        }
        else {
            updated[barIndex].chords[beatIndex] = value;
        }

        setBars(updated);
    };

    const handleChordSelection = (chordName: string, fill: boolean) => {
        updateChord(selectedBarIndex, selectedBeatIndex, chordName, fill)
        setIsDrawerOpen(false)
    };



    return (
                <div className={styles.container}>
          
                    <label className={styles.trackName}><span>Track name</span> <Input value={trackName} type="text" placeholder="Track name" required onChange={(e) => setTrackName(e.target.value)} /></label>
             
                    <label>Beats per Bar <Input value={beatsPerBar} min={3} max={4} type="number" required onChange={(e) => updateBeats(Number.parseInt(e.target.value))} /></label>
             
                    <label>Tempo (BPM)  <Input value={tempo} type="number" min={20} max={300} required onChange={(e) => setTempo(Number.parseInt(e.target.value))} /></label>

    
                {bars?.map((bar, barIndex) => (
                        <div className={styles.bar}>
                            {Array.from({ length: beatsPerBar }).map((_, beatIndex) => (
                                 
                                 <Button key={beatIndex} className={`btn-action-alt ${styles.beat} ${beatIndex === 0 ? styles.firstBeat : ""} ${beatIndex === beatsPerBar-1 ? styles.lastBeat : ""}`}
                                    onClick={() => {
                                         setSelectedBarIndex(barIndex)
                                         setSelectedBeatIndex(beatIndex)
                                         setIsDrawerOpen(true)
                                         setSelectedChord(bars[barIndex].chords[beatIndex])
                                     }
                                     }
                                     
                                 >{bars[barIndex].chords[beatIndex]?.replace("b", "♭").replace("#", "♯") || ""}</Button>
                            ))}

                             <ChordSelectorDrawer selectedChord={selectedChord} isOpen={isDrawerOpen} handleClose={() => setIsDrawerOpen(false)} handleSelect={handleChordSelection} />

                            <Button key={barIndex} className={`btn-action-alt ${styles.removeBar}`} onClick={() => removeBar(barIndex)}>
                                <Trash2 size={18} strokeWidth={1.5} />
                            </Button>
                        </div>
                ))}


            <Button className="btn-action-alt" onClick={addBar}>Add Bar</Button>


          

         

            <div className={styles.tags}>
                <h3>Tags</h3>
                
                <TagSelectorDrawer isOpen={isTagsDrawerOpen} selectedTags={tags} handleClose={() => setIsTagsDrawerOpen(false)} handleSave={(newTags) => { setTags(newTags); setIsTagsDrawerOpen(false); }} />

          
              <div className={styles.selectedTags}>
                {tags?.map((tag, tagIndex) => (
                    <Button key={tagIndex} className={`btn-active`} onClick={() => removeTag(tag)}>
                        {tag}
                         <X size={15} color='#999' />
                    </Button>
                ))}
                </div>
            </div>

            <Button onClick={saveTrack} className="btn-action">Save</Button>

        </div>
    );
}
