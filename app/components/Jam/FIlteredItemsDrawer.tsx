
"use client";

import { Drawer, DrawerHeader, DrawerItems, HR, Button } from "flowbite-react";
import { useState, useEffect } from "react";

interface FilteredItemsDrawerProps {
    isOpen: boolean
    selected: string[] // names of items that are currently included
    handleClose: () => void;
    // on apply we return array of excluded item names
    handleApply: (excludedNames: string[]) => void;
}

export default function FilteredItemsDrawer(props: FilteredItemsDrawerProps) {

    const [visibleItems, setVisibleItems] = useState<string[]>(props.selected);

    useEffect(() => {
        setVisibleItems(props.selected);
    }, [props.isOpen]);

    const toggleItem = (name: string) => {
        setVisibleItems(prev => prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]);
    }

    const onApply = () => {
        const excluded = props.selected.filter(name => !visibleItems.includes(name));
        props.handleApply(excluded);
    }

    const onClear = () => {
        // exclude none (keep all)
        props.handleApply([]);
    }

    return (
        <Drawer open={props.isOpen} onClose={props.handleClose} position="bottom">
            <DrawerHeader title="Filtered tracks" />
            <DrawerItems>
            </DrawerItems>
            <HR />
            <div className="flex m-5 flex-wrap gap-2">
                {props.selected.map((name) => (
                    <Button key={name} color={visibleItems.includes(name) ? "teal" : "light"} pill onClick={() => toggleItem(name)}>
                        {name}
                    </Button>
                ))}
            </div>

            <HR />

            <div className="flex m-5 flex-wrap gap-2">
                <Button color="teal" pill onClick={onClear}>
                    Clear
                </Button>
                <Button color="teal" pill onClick={onApply}>
                    Apply
                </Button>
            </div>

        </Drawer>
    );
}
