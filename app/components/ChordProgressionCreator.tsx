'use client';

import { useEffect, useRef, useState } from "react";
import type { TrackData, Bar } from "~/types/TrackData";
import { Button, TextInput, Drawer, DrawerHeader, DrawerItems } from "flowbite-react";
import { useNavigate } from "react-router";
import ChordSelector from "~/components/ChordSelector"

interface ChordProgressionCreatorProps {
    TrackData: TrackData | null
    Id: string
}

export default function ChordProgressionCreator(props: ChordProgressionCreatorProps) {

    const [trackName, setTrackName] = useState(props.TrackData?.name || "");
    const [beatsPerBar, setBeatsPerBar] = useState(4);

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
            setTempo(props.TrackData.tempo)
            setId(props.Id)
        }
    }, [props.TrackData]);

    const updateBeats = (value: number) => {
        setBeatsPerBar(value);
        setBars((prev) => prev.map(() => { return { chords: new Array(beatsPerBar).fill('') } }));
    };

    const addBar = () => {
        setBars((prev) => [...prev, { chords: new Array(beatsPerBar).fill('') }]);
    };

    const saveTrack = () => {
        const trackData: TrackData = {
            id: id,
            name: trackName,
            tempo: tempo,
            bars: bars,
            loop: false
        }

        localStorage.setItem(`trackData-${trackData.id}`, JSON.stringify(trackData));
        navigate(`/tracks/${id}`);
    };

    const deleteTrack = () => {
        localStorage.removeItem(`trackData-${id}`);
        navigate('/');
    };

    const updateChord = (barIndex: number, beatIndex: number, value: string) => {
        const updated = [...bars];
        updated[barIndex].chords[beatIndex] = value;
        setBars(updated);
    };

    const handleChordSelection = (chordName: string) => {
        updateChord(selectedBarIndex, selectedBeatIndex, chordName)
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

            <Button color="teal" pill onClick={addBar}>Add Bar</Button>

            <div className="space-y-6">
                {bars?.map((bar, barIndex) => (
                    <div key={barIndex} className="space-y-2">
                        <div className="grid grid-cols-4 gap-2">
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

            <ChordSelector selectedChord={selectedChord} isOpen={isDrawerOpen} handleClose={() => setIsDrawerOpen(false)} handleSelect={handleChordSelection} />

            <Button onClick={saveTrack} color="teal" pill>Save</Button>
            <Button onClick={deleteTrack} color="teal" pill>Delete</Button>
        </div>
    );
}
