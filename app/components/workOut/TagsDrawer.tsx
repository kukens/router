
"use client";

import { Drawer } from '@base-ui/react/drawer';
import { useState, useEffect, useRef } from "react";
import { Input } from '@base-ui/react/input';
import { Button } from '@base-ui/react/button';

import { WORKOUT_TRAKCS } from '~/data/workOutTracks';
import styles from './TagsDrawer.module.css';

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
    }, [props.selected]);

    return (

        <Drawer.Root>
            <Drawer.Trigger className="btn-action-alt">Select tags</Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Backdrop className="Backdrop" />
                <Drawer.Viewport className="Viewport">
                    <Drawer.Popup className="Popup">
                        <div className="Handle" />
                        <Drawer.Content className="Content">

                            <div className="drawer-header">
                                <h2>Select tags</h2>

                                <Input
                                    placeholder="Filter tags..."
                                    value={searchTerm}
                                    onValueChange={(value) => setSearchTerm(value)}
                                />
                            </div>


                            <div className={styles.scrollable}>
                                <div>
                                    {filteredTags.map((value) => (
                                        <Button key={value} className={selected.includes(value) ? "btn-active" : "btn-inactive"} onClick={() => filterItemToggle(value)}>
                                            {value}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                            <div className="drawer-footer">
                                <Button className="btn-action-alt" onClick={() => props.handleApply([])}>
                                    Clear
                                </Button>
                                <Drawer.Close className="btn-action-alt" onClick={() => props.handleApply(selected)}>Apply</Drawer.Close>
                            </div>
                        </Drawer.Content>
                    </Drawer.Popup>
                </Drawer.Viewport>
            </Drawer.Portal>

        </Drawer.Root>

    );
}