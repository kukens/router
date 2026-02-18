'use client';

import { useEffect, useRef, useState } from "react";
import type { TrackData, Bar } from "~/types/TrackData";
import { Button, TextInput } from "flowbite-react";
import { useNavigate } from "react-router";
import ChordSelectorDrawer from "~/components/ChordSelectorDrawer"
import { HR } from "flowbite-react";

interface TrackEditorProps {
    TrackData: TrackData | null
    Id: string
}

export default function TrackEditor(props: TrackEditorProps) {

    const [trackName, setTrackName] = useState(props.TrackData?.name || "");
    const [beatsPerBar, setBeatsPerBar] = useState(4);
    const [tags, setTags] = useState<string[]>([]);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
        }
    }, [props.TrackData]);

    const updateBeats = (value: number) => {
        setBeatsPerBar(value);
        setBars((prev) => prev.map((x) => { return { chords: x.chords.slice(0, value) } }));
    };

    const addBar = () => {
        setBars((prev) => [...prev, { chords: new Array(beatsPerBar).fill('') }]);
    };

    const saveTrack = () => {
        const now = new Date().toISOString();

        const trackData: TrackData = {
            id: id,
            name: trackName,
            beatsPerBar: beatsPerBar,
            tempo: tempo,
            bars: bars,
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
        <div className="p-6 max-w-xl mx-auto space-y-6">
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="dark:text-white">Track name</label>
                    <TextInput id="trackName" value={trackName} type="text" placeholder="Track name" required onChange={(e) => setTrackName(e.target.value)} />
                </div>

            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="dark:text-white">Beats per Bar</label>
                    <TextInput id="beatsPerBar" value={beatsPerBar} type="number" required onChange={(e) => updateBeats(Number.parseInt(e.target.value))} />
                </div>

                <div>
                    <label className="dark:text-white">Tempo (BPM)</label>
                    <TextInput id="tempo" value={tempo} type="number" min={20} max={300} required onChange={(e) => setTempo(Number.parseInt(e.target.value))} />
                </div>
            </div>

            <HR />


            <div className="space-y-6">
                {bars?.map((bar, barIndex) => (
                    <div key={barIndex} className="space-y-2">
                        <div className={`grid grid-cols-${beatsPerBar} gap-2`}>
                            {Array.from({ length: beatsPerBar }).map((_, beatIndex) => (
                                <Button key={beatIndex} color="light"
                                    onFocus={() => { 
                                        setSelectedBarIndex(barIndex)
                                        setSelectedBeatIndex(beatIndex)
                                        setIsDrawerOpen(true)
                                        setSelectedChord(bars[barIndex].chords[beatIndex])
                                        }
                                    }
                                >{bars[barIndex].chords[beatIndex] || ""}</Button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <Button color="alternative" pill onClick={addBar}>Add Bar</Button>


            <ChordSelectorDrawer selectedChord={selectedChord} isOpen={isDrawerOpen} handleClose={() => setIsDrawerOpen(false)} handleSelect={handleChordSelection} />

            <HR />
            <p>Tags</p>
            <Button color="alternative" pill onClick={addBar}>Add tags</Button>

            <HR />
            <Button onClick={saveTrack} color="teal" pill>Save</Button>

        </div>
    );
}
