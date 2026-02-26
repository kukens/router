
"use client";

import { Drawer, DrawerHeader, DrawerItems, HR, Button, TextInput } from "flowbite-react";
import { useState, useEffect, useRef } from "react";

import { WORKOUT_TRAKCS } from '~/data/workOutTracks';


interface TagsDrawerProps {
    isOpen: boolean
    selected: string[]
    handleClose: () => void;
    handleApply: (chords: string[]) => void;
    selectedChords?: string[];
    selectedDifficultyLevels?: string[];
}


export default function TagsDrawer(props: TagsDrawerProps) {

    const [selected, setSelected] = useState<string[]>(props.selected);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filteredTags, setFilteredTags] = useState<string[]>([]);

    const allTags = useRef<string[]>([]);

    const filterItemToggle = (value: string) => {
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
        
        // Get unique tags from filtered tracks
        const availableTags = [...new Set(baseTracks.flatMap(item => item.tags))];
        allTags.current = availableTags;
        setFilteredTags(availableTags);
    }, [props.selectedChords, props.selectedDifficultyLevels]);

    useEffect(() => {
        const filtered = allTags.current.filter(tag => 
            tag.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredTags(filtered);
    }, [searchTerm]);

    useEffect(() => {
        setSelected(props.selected)
    }, [props.isOpen]);

    return (
        <Drawer open={props.isOpen} onClose={props.handleClose} position="bottom">
            <DrawerHeader title="Select Tags" />
            <DrawerItems>
                <div className="p-4">
                    <TextInput
                        type="text"
                        placeholder="Search tags..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                    />
                </div>
            </DrawerItems>
            <HR />
                  <p>Select tags</p>
            <div className="m-5" style={{ height: '40vh', overflowY: 'auto' }}>
                <div className="flex flex-wrap gap-2">
                    {filteredTags.map((value) => (
                        <Button key={value} color={selected.includes(value) ? "teal" : "light"} pill onClick={() => filterItemToggle(value)}>
                            {value}
                        </Button>
                    ))}
                </div>
            </div>

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