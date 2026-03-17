'use client';

import { Drawer, DrawerHeader, DrawerItems, ToggleSwitch, HR } from "flowbite-react";
import { useState, useEffect } from "react";
import { CHORDS_DATA } from '~/data/chordsData';
import { WORKOUT_TRAKCS } from '~/data/workOutTracks';
import { Button } from '@base-ui/react/button';

interface ChordsDrawerProps {
    isOpen: boolean
    selected: string[]
    handleClose: () => void;
    handleApply: (chords: string[]) => void;
    selectedTags?: string[];
    selectedDifficultyLevels?: string[];
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

        // Filter tracks based on selected difficulty levels
        if (props.selectedDifficultyLevels && props.selectedDifficultyLevels.length > 0) {
            const difficultyMap: Record<string, number> = {
                "Begginer": 1,
                "Easy": 2,
                "Intermidiate": 3,
                "Advanced": 4,
                "Expert": 5
            };
            const selectedNumbers = props.selectedDifficultyLevels
                .map(level => difficultyMap[level])
                .filter(n => !isNaN(n));

            baseTracks = baseTracks.filter(track =>
                selectedNumbers.includes(track.difficulty)
            );
        }

        // Get unique chords from filtered tracks
        const availableChordsList = [...new Set(baseTracks.flatMap(item => item.chords))];
        setAvailableChords(availableChordsList);
    }, [props.selectedTags, props.selectedDifficultyLevels]);

    useEffect(() => {
        setSelectedChords(props.selected)
    }, [props.isOpen]);


    return (
        <Drawer open={props.isOpen} onClose={props.handleClose} position="bottom" >
            <DrawerHeader title="Select chord" titleIcon={() => <></>} />
            <DrawerItems>
                <p>Select scale</p>
                <div>

                    {CHORDS_DATA.map((chordType) => (
                        <Button key={chordType.name} className={getChordTypeButtonColor(chordType.name)} onClick={() => handleChordTypeSelect(chordType.name)}>
                            {chordType.name}
                        </Button>
                    ))}
                </ div>

                <HR />

                <p>Select chords</p>
                <div>
                    {CHORDS_DATA.filter(x => x.name == activeChordType).map((chordType, index) => (
                        chordType.chords.filter(chord => availableChords.includes(chord.name)).map(chord => (
                            <Button key={chord.name} className={selectedChords.some(x => x === chord.name) ? "btn-active" : "btn-inactive"} onClick={() => ChordToggle(chord.name)}>
                                {chord.name}
                            </Button>
                        ))
                    ))}
                </ div>
            </DrawerItems>

            <HR />
            <div>
                <Button className="btn-action" onClick={() => props.handleApply([])}>
                    Clear
                </Button>
                <Button className="btn-action" onClick={() => props.handleApply(selectedChords)}>
                    Apply
                </Button>
            </ div>
        </Drawer>
    );
}


