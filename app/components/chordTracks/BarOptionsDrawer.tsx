"use client";

import { Drawer } from "@base-ui/react";
import styles from './BarOptionsDrawer.module.css';


export const barOptions: Record<string, string> = {
    1: "Remove bar",
    2: "Add bar",
    3: "Open repeat block",
    4: "Close repeat block",
} as const;

interface BarOptionsDrawerProps {
    isOpen: boolean
    handleClose: () => void;
    handleSelect: (key: string) => void;
}


export default function BarOptionsDrawer(props: BarOptionsDrawerProps) {

    return (

        <Drawer.Root open={props.isOpen} swipeDirection="left">
            <Drawer.Portal>
                <Drawer.Backdrop className="Backdrop" />
                <Drawer.Viewport className="Viewport">
                    <Drawer.Popup className="Popup">
                        <div className="Handle" />
                        <Drawer.Content className="Content">

                            <h2>Bar options</h2>
                            <div className={styles.difficultyButtons}>
                                {Object.entries(barOptions).map(([key, value]) => (
                                    <Drawer.Close key={key} className={"btn-action-alt"} onClick={() => props.handleSelect(key)}>
                                        {value}
                                    </Drawer.Close>
                                ))}
                            </div>

                            <div className="drawer-footer">
                                <Drawer.Close className="btn-action-alt" onClick={props.handleClose}>Cancel</Drawer.Close>
                            </div>

                        </Drawer.Content>
                    </Drawer.Popup>
                </Drawer.Viewport>
            </Drawer.Portal>

        </Drawer.Root>


    );
}