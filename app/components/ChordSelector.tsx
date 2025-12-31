'use client';

import { Button, Drawer, DrawerHeader, DrawerItems } from "flowbite-react";
import { useState, useEffect } from "react";
import { CHORDS_DATA } from '~/data/chordsData';

interface ChordChordSelectorProps {
    isOpen: boolean
    selectedChord: string;
    handleClose: () => void;
    handleSelect: (chordName: string) => void;
}

export default function ChordSelector(props: ChordChordSelectorProps) {

    const [selectedChordType, setSelectedChordType] = useState("");
    const [activeChordType, setActiveChordType] = useState("major");

    const handleChordTypeSelect = (chordTypeName: string) => {
        setActiveChordType(chordTypeName);
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
        setSelectedChordType("")
        if (props.selectedChord) {
            const activeChordType = CHORDS_DATA.find(x => x.chords.some(y => y.name == props.selectedChord))?.name;

            setSelectedChordType(activeChordType || "");
            setActiveChordType(activeChordType || "");
        }
    }, [props.selectedChord]);

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
                <div className="flex m-5 flex-wrap gap-2">
                    {CHORDS_DATA.filter(x => x.name == activeChordType).map((chordType, index) => (
                        chordType.chords.map(chord => (
                            <Button key={chord.name} color={props.selectedChord == chord.name ? "teal" : "light"} pill onClick={() => props.handleSelect(chord.name)}>
                                {chord.name} 
                            </Button> 
                        ))
                    ))}  
                      </ div>
            </DrawerItems>
            <div className="flex m-5 flex-wrap gap-2">
                <Button color="teal" pill onClick={() => props.handleSelect("")}>
                Clear
                </Button> 
            </ div>
            </Drawer>
    );
}


