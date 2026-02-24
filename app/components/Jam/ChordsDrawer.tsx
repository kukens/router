'use client';

import { Button, Drawer, DrawerHeader, DrawerItems, ToggleSwitch, HR } from "flowbite-react";
import { useState, useEffect } from "react";
import { CHORDS_DATA } from '~/data/chordsData';

interface ChordsDrawerProps {
    isOpen: boolean
    selected: string[]
    handleClose: () => void;
    handleApply: (chords: string[]) => void;
}

export default function ChordsDrawer(props: ChordsDrawerProps) {

    const [selectedChordType, setSelectedChordType] = useState("");
    const [activeChordType, setActiveChordType] = useState("major");
    const [selectedChords, setSelectedChords] = useState<string[]>(props.selected);

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
                        chordType.chords.map(chord => (
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


