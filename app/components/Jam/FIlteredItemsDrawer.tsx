

"use client";

import { Drawer, DrawerHeader, DrawerItems, HR, Button, Card, Pagination } from "flowbite-react";
import { useState, useEffect } from "react";
import { WORKOUT_TRAKCS } from "../../data/workOutTracks";

interface FilteredItemsDrawerProps {
    isOpen: boolean
    selected: string[] // names of items that are currently included
    handleClose: () => void;
    // on apply we return array of excluded item names
    handleApply: (excludedNames: string[]) => void;
}

const ITEMS_PER_PAGE = 6;

export default function FilteredItemsDrawer(props: FilteredItemsDrawerProps) {
    const [visibleItems, setVisibleItems] = useState<string[]>(props.selected);
    const [orderedItems, setOrderedItems] = useState<string[]>(props.selected);
    const [draggedItem, setDraggedItem] = useState<string | null>(null);

    useEffect(() => {
        setVisibleItems(props.selected);
        setOrderedItems(props.selected);
    }, [props.isOpen]);

    const toggleItem = (name: string) => {
        setVisibleItems(prev => prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]);
    }

    const onApply = () => {
        const excluded = props.selected.filter(name => !visibleItems.includes(name));
        props.handleApply(excluded);
    }

    const handleDragStart = undefined;
    const handleDragEnd = undefined;

    // Touch events for mobile support
    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>, itemName: string) => {
        const targetElement = e.currentTarget;
        setDraggedItem(itemName);
        targetElement.style.opacity = '0.5';

        const handleTouchMove = (moveEvent: TouchEvent) => {
            moveEvent.preventDefault();
        };

        const handleTouchEnd = (endEvent: TouchEvent) => {
            endEvent.preventDefault();
            targetElement.style.opacity = '1';

            const touch = endEvent.changedTouches[0];
            const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
            const targetCard = elementBelow?.closest('[data-track-name]');

            if (targetCard && targetCard.getAttribute('data-track-name') !== itemName) {
                const targetItem = targetCard.getAttribute('data-track-name');
                if (targetItem) {
                    const newOrderedItems = [...orderedItems];
                    const draggedIndex = newOrderedItems.indexOf(itemName);
                    const targetIndex = newOrderedItems.indexOf(targetItem);

                    if (draggedIndex !== -1 && targetIndex !== -1) {
                        newOrderedItems.splice(draggedIndex, 1);
                        newOrderedItems.splice(targetIndex, 0, itemName);
                        setOrderedItems(newOrderedItems);
                    }
                }
            }

            setDraggedItem(null);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };

        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd);
    };

    const handleDragOver = undefined;
    const handleDrop = undefined;

    const onClear = () => {
        // exclude none (keep all)
        props.handleApply([]);
    }

    const getTrackData = (trackName: string) => {
        return WORKOUT_TRAKCS.find(track => track.name === trackName);
    }

    return (
        <Drawer open={props.isOpen} onClose={props.handleClose} position="bottom" className="h-[70vh]">
            <DrawerHeader title="Filtered tracks" />
            <DrawerItems>
                <div className="p-2 h-full">
                    <div className="space-y-2 overflow-y-auto max-h-[calc(70vh-120px)]">
                        {orderedItems.map((trackName) => {
                            const trackData = getTrackData(trackName);
                            const isVisible = visibleItems.includes(trackName);
                            const isDragging = draggedItem === trackName;

                            return (
                                <Card 
                                    key={trackName}
                                    data-track-name={trackName}
                                    className={`transition-all duration-200 ${
                                        isVisible 
                                            ? 'ring-1 ring-teal-500 bg-teal-50' 
                                            : 'hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="px-3 py-2">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                <div 
                                                    className="text-gray-400 mr-1 cursor-move select-none hover:text-gray-600"
                                                    onTouchStart={(e) => handleTouchStart(e, trackName)}
                                                >
                                                    ⋮⋮
                                                </div>
                                                <h6 className="text-sm font-medium text-gray-900 truncate">
                                                    {trackName}
                                                </h6>
                                                {trackData && (
                                                    <div className="flex flex-wrap gap-0.5">
                                                        {trackData.chords.map((chord, index) => (
                                                            <span 
                                                                key={index}
                                                                className="inline-block px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded"
                                                            >
                                                                {chord}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 ml-2">
                                                <input
                                                    type="checkbox"
                                                    checked={isVisible}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        toggleItem(trackName);
                                                    }}
                                                    className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </DrawerItems>

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

