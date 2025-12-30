'use client';

import { Button, Drawer, DrawerHeader, DrawerItems } from "flowbite-react";
import { useState } from "react";
import { CHORDS_DATA } from '~/data/chordsData';


interface ChordChordSelectorProps {
    isOpen: boolean
    handleClose: () => void;
    handleSelect: (chordName: string) => void;
}

export default function ChordSelector(props: ChordChordSelectorProps) {

    const [chordType, setChordType] = useState("major");

    const handleChordTypeSelect = (chordTypeName: string) => {
        setChordType(chordTypeName);
    }

    return (
        <Drawer open={props.isOpen} onClose={props.handleClose} position="bottom">
                <DrawerHeader title="Drawer" />
                <DrawerItems>
                    <div className="flex flex-wrap gap-2">
                    {CHORDS_DATA.map((chordType, index) => (
                        <Button key={index} as="span" color="teal" pill onClick={() => handleChordTypeSelect(chordType.name)}>
                            {chordType.name} 
                        </Button>  
                    ))}  
                    </ div>
                <div className="flex flex-wrap gap-2">
                    {CHORDS_DATA.filter(x => x.name == chordType).map((chordType, index) => (
                        chordType.chords.map(chord => (
                            <Button key={chord.name} as="span" color="light" pill onClick={() => props.handleSelect(chord.name)}>
                                {chord.name} 
                            </Button> 
                        ))
                    ))}  
                      </ div>
                  
                </DrawerItems>
            </Drawer>
    );
}
