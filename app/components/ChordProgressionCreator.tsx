'use client';

import { useEffect, useRef, useState } from "react";
import type { TrackData, Bar } from "~/types/TrackData";
import { Button, TextInput } from "flowbite-react";
import { useNavigate } from "react-router";

interface ChordProgressionCreatorProps {
  TrackData: TrackData | null
  Id: string
}

export default function ChordProgressionCreator(props: ChordProgressionCreatorProps) {

  const [trackName, setTrackName] = useState(props.TrackData?.name || "");
  const [beatsPerBar, setBeatsPerBar] = useState(4);
  const [tempo, setTempo] = useState(props.TrackData?.tempo || 120);
  const [id, setId] = useState(props.Id || crypto.randomUUID());
  const [bars, setBars] = useState<Bar[]>(props.TrackData?.bars ||[{ chords: new Array(beatsPerBar).fill('') }]);
  
  const navigate = useNavigate();

  const beatsElementsRef = useRef<HTMLInputElement[]>([]);

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
    let bars: Bar[] = [];

    beatsElementsRef.current.forEach((element, index) => {
      const barIndex = Math.floor(index / beatsPerBar);

      if (index % beatsPerBar == 0) {
        const bar: Bar = {
          chords: []
        };
        bars.push(bar)
      }
      bars[barIndex].chords.push(element.value);
    });

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

  const registerBeats = (el: HTMLInputElement | null) => {
    if (el && !beatsElementsRef.current.includes(el)) {
      beatsElementsRef.current.push(el);
    }
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
                <TextInput key={beatIndex} ref={registerBeats} type="text" required
                  value={bars[barIndex].chords[beatIndex] || ""}
                  onChange={(e) => updateChord(barIndex, beatIndex, e.target.value)} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <Button onClick={saveTrack} color="teal" pill>Save</Button>
      <Button onClick={deleteTrack} color="teal" pill>Delete</Button>
    </div>
  );
}
