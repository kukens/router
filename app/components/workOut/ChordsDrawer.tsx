'use client';

import { Drawer } from '@base-ui/react/drawer';
import { useState, useEffect } from "react";
import { CHORDS_DATA } from '~/data/chordsData';
import { Button } from '@base-ui/react/button';
import styles from './ChordsDrawer.module.css'
import { EighthNote, EighthNotes, HalfNote, ListChecks, ListMusic } from 'lucide-react';
import { WORKOUT_TRAKCS } from '~/data/workOutTracks';


interface ChordsDrawerProps {
    isOpen: boolean
    selected: string[]
    handleClose: () => void;
    handleApply: (chords: string[]) => void;
    selectedTags?: string[];
}

export default function ChordsDrawer(props: ChordsDrawerProps) {

    const [selectedChordType, setSelectedChordType] = useState("");
    const [activeChordType, setActiveChordType] = useState("major");
    const [selectedChords, setSelectedChords] = useState<string[]>(props.selected);
    const [availableChords, setAvailableChords] = useState<string[]>([]);

    const handleChordTypeSelect = (chordTypeName: string) => {
        setActiveChordType(chordTypeName);
    }

    const ChordToggle = (chordName: string) => {
        setSelectedChords(prev => prev.includes(chordName) ? prev.filter(i => i !== chordName) : [...prev, chordName]);
    }

    const getChordTypeButtonColor = (chordType: string) => {

        if (activeChordType == chordType) {
            return "btn-active"
        }

        if (selectedChordType == chordType) {
            return "btn-action"
        }

        return "btn-inactive"
    }

    useEffect(() => {
        let baseTracks = WORKOUT_TRAKCS;

        // Filter tracks based on selected tags
        if (props.selectedTags && props.selectedTags.length > 0) {
            baseTracks = baseTracks.filter(track =>
                props.selectedTags!.some(tag => track.tags.includes(tag))
            );
        }

        // Get unique chords from filtered tracks
        const availableChordsList = [...new Set(baseTracks.flatMap(item => item.chords))];
        setAvailableChords(availableChordsList);
    }, [props.selectedTags]);

    useEffect(() => {
        setSelectedChords(props.selected)
    }, [props.selected]);


    return (

        <Drawer.Root>
            <Drawer.Trigger className="btn-action-alt btn-txt-icon">
{/* <EighthNotes size={18}/> */}
<svg style={{ scale: '0.85' }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 1 24 24" fill="none" stroke="currentColor" stroke-width="0">
  <ellipse cx="10.5" cy="18.5" rx="5.5" ry="2.8" transform="rotate(-10 10.5 18.5)" fill="#b2c1d0" stroke="none" />
  <ellipse cx="10.5" cy="12.5" rx="5.5" ry="2.8" transform="rotate(-10 10.5 12.5)" fill="#b2c1d0" stroke="none" />
  <ellipse cx="10.5" cy="6.5" rx="5.5" ry="2.8" transform="rotate(-10 10.5 6.5)" fill="#b2c1d0" stroke="none" />
</svg>

Choose chords  </Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Backdrop className="Backdrop" />
                <Drawer.Viewport className="Viewport">
                    <Drawer.Popup className="Popup">
                        <div className="Handle" />
                        <Drawer.Content className="Content">
                            <div className={styles.container}>
                                
                                <h2>Select scale</h2>

                                <div className={`${styles.scale} ${styles.buttonSpacing}`}>
                                    {CHORDS_DATA.map((chordType) => (
                                        <Button key={chordType.name} className={getChordTypeButtonColor(chordType.name)} onClick={() => handleChordTypeSelect(chordType.name)}>
                                            {chordType.name}
                                        </Button>
                                    ))}
                                </div>

                                <h2>Select chords</h2>

                                <div className={`${styles.chords} ${styles.buttonSpacing}`}>

                                    

                                    {CHORDS_DATA.filter(x => x.name == activeChordType).map((chordType, index) => (
                                        chordType.chords.filter(chord => availableChords.includes(chord.name)).map(chord => (
                                            <Button key={chord.name} className={selectedChords.some(x => x === chord.name) ? "btn-active" : "btn-inactive"} onClick={() => ChordToggle(chord.name)}>
                                                {chord.name.replace("b", "♭").replace("#", "♯") }
                                            </Button>
                                        ))
                                    ))}

                                 
                                </div></div>
                            <div className="drawer-footer">
                                <Button className="btn-action-alt" onClick={() => props.handleApply([])}>
                                    Clear
                                </Button>
                                <Drawer.Close className="btn-action-alt" onClick={() => props.handleApply(selectedChords)}>Apply</Drawer.Close>
                            </div>

                        </Drawer.Content>
                    </Drawer.Popup>
                </Drawer.Viewport>
            </Drawer.Portal>

        </Drawer.Root >


    );
}


