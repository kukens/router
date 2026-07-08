'use client';

import { Drawer } from '@base-ui/react/drawer';
import { Button } from '@base-ui/react/button';
import { Switch } from '@base-ui/react/switch';
import { useState, useEffect } from "react";
import { CHORDS_DATA } from '~/data/chordsData';
import styles from "./ChordSelectorDrawer.module.css";
import switchStyles from "~/theme/Switch.module.css";

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

            const activeChordType = props.selectedChord === "-" ? CHORDS_DATA[0].name : CHORDS_DATA.find(x => x.chords.some(y => y.name == props.selectedChord))?.name;

            setSelectedChordType(activeChordType || "");
            setActiveChordType(activeChordType || "");
        }
    }, [props.selectedChord]);

    return (
        


 <Drawer.Root open={props.isOpen} onOpenChange={(open) => { if (!open) props.handleClose(); }}>
            
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

                                <h2>Select chord</h2>

                                <div className={`${styles.chords} ${styles.buttonSpacing}`}>

                        {CHORDS_DATA.filter(x => x.name == activeChordType).map((chordType, index) => (
                                            chordType.chords.map(chord => (
                                                <Drawer.Close key={chord.name} className={props.selectedChord == chord.name ? "btn-active" : "btn-action-alt"} onClick={() => props.handleSelect(chord.name, fill)}>
                                                    {chord.name.replace("b", "♭").replace("#", "♯") } 
                                                </Drawer.Close> 
                                            ))
                                        ))}  
                                 
                                </div></div>
                            <div className="drawer-footer">
                                <Drawer.Close className="btn-action-alt" onClick={() => props.handleSelect('-', fill)}>Clear</Drawer.Close>
                          <label className={switchStyles.Label}>
                            <Switch.Root defaultChecked className={switchStyles.Switch} onCheckedChange={(checked) => setFill(checked)}>
                                <Switch.Thumb className={switchStyles.Thumb} />
                            </Switch.Root>
                                        Apply to all beats in bar
                            </label>
                            
                            </div>

                        </Drawer.Content>
                    </Drawer.Popup>
                </Drawer.Viewport>
            </Drawer.Portal>

        </Drawer.Root >
    );
}


