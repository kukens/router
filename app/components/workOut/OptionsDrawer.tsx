"use client";

import { Drawer } from '@base-ui/react/drawer';
import { Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Input } from '@base-ui/react/input';
import { Slider } from '@base-ui/react/slider';
import styles from './OptionsDrawer.module.css';

const SUCCESSFUL_TRIES_STORAGE_KEY = 'successful_tries';
const TEMPO_STORAGE_KEY = 'tempo';

export default function OptionsDrawer() {
    const [successfulTries, setSuccessfulTries] = useState(3);
    const [tempo, setTempo] = useState(120);

    useEffect(() => {
        const storedSuccessfulTries = Number(localStorage.getItem(SUCCESSFUL_TRIES_STORAGE_KEY));
        const storedTempo = Number(localStorage.getItem(TEMPO_STORAGE_KEY));

        if (storedSuccessfulTries > 0) setSuccessfulTries(storedSuccessfulTries);
        if (storedTempo >= 40 && storedTempo <= 150) setTempo(storedTempo);
    }, []);

    const updateSuccessfulTries = (value: string) => {
        const tries = Math.max(1, Number(value) || 1);
        setSuccessfulTries(tries);
        localStorage.setItem(SUCCESSFUL_TRIES_STORAGE_KEY, String(tries));
    };

    const updateTempo = (value: number) => {
        setTempo(value);
        localStorage.setItem(TEMPO_STORAGE_KEY, String(value));
    };

    return (
        <Drawer.Root>
            <Drawer.Trigger className="btn-action-alt btn-txt-icon">
                <Settings size={16} /> Options
            </Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Backdrop className="Backdrop" />
                <Drawer.Viewport className="Viewport">
                    <Drawer.Popup className="Popup">
                        <div className="Handle" />
                        <Drawer.Content className="Content">
                            <div className="drawer-header">
                                <h2>Options</h2>
                            </div>
                            <div className={styles.options}>
                                <label className={styles.option}>
                                    <span>Successful workout attempts in a row required to advance</span>
                                    <Input
                                        className={styles.input}
                                        type="number"
                                        min={1}
                                        value={String(successfulTries)}
                                        onChange={(event) => updateSuccessfulTries(event.target.value)}
                                    />
                                </label>

                                <label className={styles.option}>
                                    
                                        Tempo
                                        <span className={styles.numberLabel}>{tempo}</span>
                                  
                                    <Slider.Root
                                        className={styles.sliderRoot}
                                        value={tempo}
                                        onValueChange={updateTempo}
                                        max={150}
                                        min={40}
                                        step={1}
                                    >
                                        <Slider.Control className={styles.Control}>
                                            <Slider.Track className={styles.Track}>
                                                <Slider.Indicator className={styles.Indicator} />
                                                <Slider.Thumb aria-label="Tempo" className={styles.Thumb} />
                                            </Slider.Track>
                                        </Slider.Control>
                                    </Slider.Root>
                                </label>
                            </div>
                               <div className="drawer-footer">
                                       <div className={styles.footer}>
                                   <div className={styles.actions}>
                                             </div>
                                    <Drawer.Close className="btn-action-alt">Apply</Drawer.Close>
                                 </div>
                            </div>
                        </Drawer.Content>
                        
                    </Drawer.Popup>
                </Drawer.Viewport>
            </Drawer.Portal>
        </Drawer.Root>
    );
}
