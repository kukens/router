"use client";

import { Drawer, DrawerHeader, DrawerItems, HR, Button } from "flowbite-react";
import { useState, useEffect } from "react";

export const difficultyLevels: Record<string, string> = {
    1: "Begginer",
    2: "Easy",
    3: "Intermidiate",
    4: "Advanced",
    5: "Expert"
} as const;

interface DifficultyDrawerProps {
    isOpen: boolean
    selected: string[]
    handleClose: () => void;
    handleApply: (chords: string[]) => void;
}


export default function DifficultyDrawer(props: DifficultyDrawerProps) {

    const [selected, setSelected] = useState<string[]>(props.selected);

    const difficultyLevelToggle = (value: string) => {
        setSelected(prev => prev.includes(value) ? prev.filter(i => i !== value) : [...prev, value]);
    }

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
                {Object.entries(difficultyLevels).map(([key, value]) => (
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