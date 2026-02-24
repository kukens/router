
"use client";

import { Drawer, DrawerHeader, DrawerItems, HR, Button } from "flowbite-react";
import { useState, useEffect, useRef } from "react";

import { WORKOUT_TRAKCS } from '~/data/workOutTracks';


interface TagsDrawerProps {
    isOpen: boolean
    selected: string[]
    handleClose: () => void;
    handleApply: (chords: string[]) => void;
}


export default function TagsDrawer(props: TagsDrawerProps) {

    const [selected, setSelected] = useState<string[]>(props.selected);

    const allTags = useRef<string[]>([]);

    const filterItemToggle = (value: string) => {
        setSelected(prev => prev.includes(value) ? prev.filter(i => i !== value) : [...prev, value]);
    }

    useEffect(() => {
        allTags.current = [...new Set(WORKOUT_TRAKCS.flatMap(item => item.tags))];

        console.log(allTags)
    }, []);


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
                {allTags.current.map((value) => (
                <Button key={value} color={selected.includes(value) ? "teal" : "light"} pill onClick={() => filterItemToggle(value)}>
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