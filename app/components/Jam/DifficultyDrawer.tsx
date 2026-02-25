"use client";

import { Drawer, DrawerHeader, DrawerItems, HR, Button } from "flowbite-react";
import { useState, useEffect } from "react";
import { WORKOUT_TRAKCS } from '~/data/workOutTracks';

export const difficultyLevels: Record<string, string> = {
    1: "Begginer",
    2: "Easy",
    3: "Intermediate",
    4: "Advanced",
    5: "Expert"
} as const;

interface DifficultyDrawerProps {
    isOpen: boolean
    selected: string[]
    handleClose: () => void;
    handleApply: (chords: string[]) => void;
    selectedChords?: string[];
    selectedTags?: string[];
}


export default function DifficultyDrawer(props: DifficultyDrawerProps) {

    const [selected, setSelected] = useState<string[]>(props.selected);
    const [availableDifficulties, setAvailableDifficulties] = useState<string[]>([]);

    const difficultyLevelToggle = (value: string) => {
        setSelected(prev => prev.includes(value) ? prev.filter(i => i !== value) : [...prev, value]);
    }

    useEffect(() => {
        let baseTracks = WORKOUT_TRAKCS;
        
        // Filter tracks based on selected chords
        if (props.selectedChords && props.selectedChords.length > 0) {
            baseTracks = baseTracks.filter(track => 
                props.selectedChords!.every(chord => track.chords.includes(chord))
            );
        }
        
        // Filter tracks based on selected tags
        if (props.selectedTags && props.selectedTags.length > 0) {
            baseTracks = baseTracks.filter(track => 
                props.selectedTags!.some(tag => track.tags.includes(tag))
            );
        }
        
        // Get unique difficulties from filtered tracks
        const availableDifficultyNumbers = [...new Set(baseTracks.map(item => item.difficulty))];
        const availableDifficultyLabels = availableDifficultyNumbers
            .map(num => difficultyLevels[num.toString()])
            .filter(label => label !== undefined);
        
        setAvailableDifficulties(availableDifficultyLabels);
    }, [props.selectedChords, props.selectedTags]);

    useEffect(() => {
        setSelected(props.selected)
    }, [props.isOpen]);

    return (
        <Drawer open={props.isOpen} onClose={props.handleClose} position="bottom">
            <DrawerHeader title="Filter tracks" />
            <DrawerItems>

            </DrawerItems>
            <HR />
            <div className="flex m-5 flex-wrap gap-2">
                {Object.entries(difficultyLevels).filter(([key, value]) => availableDifficulties.includes(value)).map(([key, value]) => (
                    <Button key={key} color={selected.includes(value) ? "teal" : "light"} pill onClick={() => difficultyLevelToggle(value)}>
                        {value}
                    </Button>
                ))}

            </ div>



            <HR />

                <div className="flex m-5 flex-wrap gap-2">
                    <Button color="teal" pill onClick={() => props.handleApply([])}>
                        Clear
                    </Button>
                    <Button color="teal" pill onClick={() => props.handleApply(selected)}>
                        Apply
                    </Button>
                </ div>
            
        </Drawer>
    );
}