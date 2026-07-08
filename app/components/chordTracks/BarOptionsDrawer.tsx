"use client";

import { Drawer } from "@base-ui/react";
import styles from './BarOptionsDrawer.module.css';


export const BAR_OPTION_ADD = 'add';
export const BAR_OPTION_REMOVE = 'remove';
export const BAR_OPTION_REPEAT = 'repeat';

export const barOptions = {
    [BAR_OPTION_ADD]: "Add bar",
    [BAR_OPTION_REMOVE]: "Remove bar",
    [BAR_OPTION_REPEAT]: "Set repeat",
} as const;

interface BarOptionsDrawerProps {
    isOpen: boolean
    handleClose: () => void;
    handleSelect: (key: string) => void;
    canSetRepeat: boolean;
}


export default function BarOptionsDrawer(props: BarOptionsDrawerProps) {

    return (

        <Drawer.Root open={props.isOpen} onOpenChange={(open) => { if (!open) props.handleClose(); }}>
            <Drawer.Portal>
                <Drawer.Backdrop className="Backdrop" />
                <Drawer.Viewport className="Viewport">
                    <Drawer.Popup className="Popup">
                        <div className="Handle" />
                        <Drawer.Content className="Content">

                            <h2>Bar options</h2>
                            <div className={styles.difficultyButtons}>
                                {Object.entries(barOptions)
                                    .filter(([key]) => props.canSetRepeat || key !== BAR_OPTION_REPEAT)
                                    .map(([key, value]) => (
                                    <Drawer.Close key={key} className={"btn-action-alt"} onClick={() => props.handleSelect(key)}>
                                        {value}
                                    </Drawer.Close>
                                ))}
                            </div>

                            <div className="drawer-footer">
                                
                            </div>

                        </Drawer.Content>
                    </Drawer.Popup>
                </Drawer.Viewport>
            </Drawer.Portal>

        </Drawer.Root>


    );
}