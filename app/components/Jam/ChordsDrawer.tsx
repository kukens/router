'use client';

import { Button, Drawer, DrawerHeader, DrawerItems, ToggleSwitch, HR } from "flowbite-react";
import { useState, useEffect } from "react";
import { CHORDS_DATA } from '~/data/chordsData';
import { WORKOUT_TRAKCS } from '~/data/workOutTracks';

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
            return "teal"
        }

        if (selectedChordType == chordType) {
            return "alternative"
        }

        return "light"
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
                <div className="flex m-5 flex-wrap gap-2">
                    
                    {CHORDS_DATA.map((chordType, index) => (
                        <Button key={index} color={getChordTypeButtonColor(chordType.name)} pill onClick={() => handleChordTypeSelect(chordType.name)}>
                            {chordType.name}
                        </Button>
                    ))}
                </ div>

                <HR />
                <div className="flex m-5 flex-wrap gap-2">
                    {CHORDS_DATA.filter(x => x.name == activeChordType).map((chordType, index) => (
                        chordType.chords.filter(chord => availableChords.includes(chord.name)).map(chord => (
                            <Button key={chord.name} color={selectedChords.some(x => x === chord.name) ? "teal" : "light"} pill onClick={() => ChordToggle(chord.name)}>
                                {chord.name}
                            </Button>
                        ))
                    ))}
                </ div>
            </DrawerItems>
            <HR />
            <div className="flex m-5 flex-wrap gap-2">
                <Button color="teal" pill onClick={() => props.handleApply([])}>
                    Clear
                </Button>
                <Button color="teal" pill onClick={() => props.handleApply(selectedChords)}>
                    Apply
                </Button>
            </ div>
        </Drawer>
    );
}


