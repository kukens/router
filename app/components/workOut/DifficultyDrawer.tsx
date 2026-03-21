"use client";

import { Drawer } from "@base-ui/react";
import { useState, useEffect } from "react";
import { WORKOUT_TRAKCS } from '~/data/workOutTracks';
import { Button } from '@base-ui/react/button';
import { ArrowUpRight, PictureInPicture2 } from "lucide-react";

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

  <Drawer.Root>
            <Drawer.Trigger className="btn-action-alt">Select difficulty</Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Backdrop className="Backdrop" />
                <Drawer.Viewport className="Viewport">
                    <Drawer.Popup className="Popup">
                        <div className="Handle" />
                        <Drawer.Content className="Content">
                            <Drawer.Description className="Description">

                                <p>Select chords</p>
                        
                    {Object.entries(difficultyLevels).filter(([key, value]) => availableDifficulties.includes(value)).map(([key, value]) => (
                            <Button key={key} className={selected.includes(value) ? "btn-active" : "btn-inactive"} onClick={() => difficultyLevelToggle(value)}>
                                {value}
                            </Button>
                        ))}
                           
                                <Button className="btn-action-alt" onClick={() => props.handleApply([])}>
                                    Clear
                                </Button>
                                <Drawer.Close className="btn-action-alt" onClick={() => props.handleApply(selected)}>Apply</Drawer.Close>
                            </Drawer.Description>
                        </Drawer.Content>
                    </Drawer.Popup>
                </Drawer.Viewport>
            </Drawer.Portal>

        </Drawer.Root>


    );
}