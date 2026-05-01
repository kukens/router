'use client';

import { Drawer } from '@base-ui/react/drawer';
import { Button } from '@base-ui/react/button';
import { useState, useEffect } from "react";
import { CHORDS_DATA } from '~/data/chordsData';
import styles from "./ChordSelectorDrawer.module.css";

interface ChordSelectorDrawerProps {
    isOpen: boolean
    selectedChord: string;
    handleClose: () => void;
    handleSelect: (chordName: string, fill: boolean) => void;
}



export default function ChordSelectorDrawer(props: ChordSelectorDrawerProps) {

    const [selectedChordType, setSelectedChordType] = useState("");
    const [activeChordType, setActiveChordType] = useState("major");
    const [fill, setFill] = useState(true);

    const handleChordTypeSelect = (chordTypeName: string) => {
        setActiveChordType(chordTypeName);
    }

    const getChordTypeButtonColor = (chordType: string) => {

        if (activeChordType == chordType) {
            return "btn-active"
        }

        if (selectedChordType == chordType) {
            return "btn-action-alt"
        }

        return "btn-inactive"
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
        


 <Drawer.Root open={props.isOpen}>
            
            <Drawer.Portal>
                <Drawer.Backdrop className="Backdrop" />
                <Drawer.Viewport className="Viewport">
                    <Drawer.Popup className="Popup">
                        <div className="Handle" />
                        <Drawer.Content className="Content">
                            <div className={styles.container}>
                                <h2>Select scale</h2>

                                <div className={`${styles.scale} ${styles.buttonSpacing}`}>
                            {CHORDS_DATA.map((chordType, index) => (
                                <Button key={index} className={getChordTypeButtonColor(chordType.name)} onClick={() => handleChordTypeSelect(chordType.name)}>
                                    {chordType.name} 
                                </Button>  
                            ))}  
                                </div>

                                <h2>Select chords</h2>

                                <div className={`${styles.chords} ${styles.buttonSpacing}`}>

                        {CHORDS_DATA.filter(x => x.name == activeChordType).map((chordType, index) => (
                                            chordType.chords.map(chord => (
                                                <Drawer.Close key={chord.name} className={props.selectedChord == chord.name ? "btn-active" : "btn-inactive"} onClick={() => props.handleSelect(chord.name, fill)}>
                                                    {chord.name.replace("b", "♭").replace("#", "♯") } 
                                                </Drawer.Close> 
                                            ))
                                        ))}  
                                 
                                </div></div>
                            <div className="drawer-footer">
                                  <Drawer.Close className="btn-action-alt" onClick={props.handleClose}>Cancel</Drawer.Close>
                            </div>

                        </Drawer.Content>
                    </Drawer.Popup>
                </Drawer.Viewport>
            </Drawer.Portal>

        </Drawer.Root >
    );
}


