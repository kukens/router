

"use client";

import { Drawer, DrawerHeader, DrawerItems, HR, Button, Checkbox, Label } from "flowbite-react";
import { useState, useEffect, useRef } from "react";
import { WORKOUT_TRAKCS } from "../../data/workOutTracks";
import { DotsVertical } from "flowbite-react-icons/outline";

interface FilteredItemsDrawerProps {
    isOpen: boolean
    items: string[] // all item names in the drawer (including excluded)
    excluded: string[] // currently excluded item names
    handleClose: () => void;
    // on apply we return array of excluded item names and the new order
    handleApply: (excludedNames: string[], newOrder: string[]) => void;
    orderedItems: string[] // the current order of items
}

export default function FilteredItemsDrawer(props: FilteredItemsDrawerProps) {
    const [visibleItems, setVisibleItems] = useState<string[]>(props.items);
    const [orderedItems, setOrderedItems] = useState<string[]>(props.items);
    const [draggedItem, setDraggedItem] = useState<string | null>(null);
    const [placeholderIndex, setPlaceholderIndex] = useState<number | null>(null);

    const listContainerRef = useRef<HTMLDivElement | null>(null);
    const dragStateRef = useRef<{ itemName: string; pointerId: number } | null>(null);
    const placeholderIndexRef = useRef<number | null>(null);

    const lastClientYRef = useRef<number | null>(null);
    const autoScrollRafRef = useRef<number | null>(null);
    const autoScrollSpeedRef = useRef<number>(0);

    useEffect(() => {
        setVisibleItems(props.items.filter(n => !props.excluded.includes(n)));

        const baseOrder = (props.orderedItems.length > 0 ? props.orderedItems : props.items);
        const missing = props.items.filter(n => !baseOrder.includes(n));
        const pruned = baseOrder.filter(n => props.items.includes(n));
        setOrderedItems([...pruned, ...missing]);
    }, [props.isOpen, props.items, props.excluded, props.orderedItems]);

    const toggleItem = (name: string) => {
        setVisibleItems(prev => prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]);
    }

    const onApply = () => {
        const excluded = props.items.filter(name => !visibleItems.includes(name));
        props.handleApply(excluded, orderedItems);
    }

    const computePlaceholderIndex = (clientY: number, draggingName: string) => {
        const container = listContainerRef.current;
        if (!container) return;

        const itemElements = Array.from(container.querySelectorAll<HTMLElement>('[data-track-name]'));
        const visibleItemElements = itemElements.filter(el => el.getAttribute('data-track-name') !== draggingName);

        for (let i = 0; i < visibleItemElements.length; i++) {
            const rect = visibleItemElements[i].getBoundingClientRect();
            const midY = rect.top + rect.height / 2;
            if (clientY < midY) {
                const name = visibleItemElements[i].getAttribute('data-track-name');
                if (!name) return;
                const idx = orderedItems.indexOf(name);
                const nextIndex = idx === -1 ? null : idx;
                placeholderIndexRef.current = nextIndex;
                setPlaceholderIndex(nextIndex);
                return;
            }
        }

        placeholderIndexRef.current = orderedItems.length;
        setPlaceholderIndex(orderedItems.length);
    };

    const finalizeReorder = (draggingName: string, insertIndex: number | null) => {
        if (insertIndex === null) return;
        const from = orderedItems.indexOf(draggingName);
        if (from === -1) return;

        const next = [...orderedItems];
        next.splice(from, 1);
        const adjusted = from < insertIndex ? insertIndex - 1 : insertIndex;
        next.splice(adjusted, 0, draggingName);
        setOrderedItems(next);
    };

    const stopAutoScroll = () => {
        autoScrollSpeedRef.current = 0;
        if (autoScrollRafRef.current !== null) {
            cancelAnimationFrame(autoScrollRafRef.current);
            autoScrollRafRef.current = null;
        }
    };

    const startAutoScrollIfNeeded = () => {
        if (autoScrollRafRef.current !== null) return;

        const tick = () => {
            const container = listContainerRef.current;
            const dragState = dragStateRef.current;
            const clientY = lastClientYRef.current;

            if (!container || !dragState || clientY === null) {
                stopAutoScroll();
                return;
            }

            const speed = autoScrollSpeedRef.current;
            if (speed !== 0) {
                container.scrollTop += speed;
                computePlaceholderIndex(clientY, dragState.itemName);
            }

            autoScrollRafRef.current = requestAnimationFrame(tick);
        };

        autoScrollRafRef.current = requestAnimationFrame(tick);
    };

    const updateAutoScrollSpeed = (clientY: number) => {
        const container = listContainerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const edgeThreshold = 48;
        const maxSpeed = 16;

        const distToTop = clientY - rect.top;
        const distToBottom = rect.bottom - clientY;

        let speed = 0;
        if (distToTop >= 0 && distToTop < edgeThreshold) {
            const strength = (edgeThreshold - distToTop) / edgeThreshold;
            speed = -Math.max(2, Math.round(maxSpeed * strength));
        } else if (distToBottom >= 0 && distToBottom < edgeThreshold) {
            const strength = (edgeThreshold - distToBottom) / edgeThreshold;
            speed = Math.max(2, Math.round(maxSpeed * strength));
        }

        autoScrollSpeedRef.current = speed;
        if (speed === 0) {
            stopAutoScroll();
        } else {
            startAutoScrollIfNeeded();
        }
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, itemName: string) => {
        if (e.pointerType !== 'touch' && e.pointerType !== 'pen' && e.pointerType !== 'mouse') return;
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);

        dragStateRef.current = { itemName, pointerId: e.pointerId };
        setDraggedItem(itemName);
        lastClientYRef.current = e.clientY;
        computePlaceholderIndex(e.clientY, itemName);
        updateAutoScrollSpeed(e.clientY);

        const onMove = (ev: PointerEvent) => {
            if (!dragStateRef.current) return;
            if (ev.pointerId !== dragStateRef.current.pointerId) return;
            ev.preventDefault();
            lastClientYRef.current = ev.clientY;
            computePlaceholderIndex(ev.clientY, dragStateRef.current.itemName);
            updateAutoScrollSpeed(ev.clientY);
        };

        const onUp = (ev: PointerEvent) => {
            if (!dragStateRef.current) return;
            if (ev.pointerId !== dragStateRef.current.pointerId) return;

            const { itemName: draggingName } = dragStateRef.current;
            finalizeReorder(draggingName, placeholderIndexRef.current);

            dragStateRef.current = null;
            setDraggedItem(null);
            setPlaceholderIndex(null);
            placeholderIndexRef.current = null;
            lastClientYRef.current = null;
            stopAutoScroll();

            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
            window.removeEventListener('pointercancel', onUp);
        };

        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
        window.addEventListener('pointercancel', onUp);
    };

    const handleDragOver = undefined;
    const handleDrop = undefined;

    const onClear = () => {
        // exclude none (keep all)
        props.handleApply([], orderedItems);
    }

    const getTrackData = (trackName: string) => {
        return WORKOUT_TRAKCS.find(track => track.name === trackName);
    }

    return (
        <Drawer open={props.isOpen} onClose={props.handleClose} position="bottom" className="h-[70vh]">
            <DrawerHeader title="Filtered tracks" />
            <DrawerItems>
                <div className="p-2 h-full">
                    <div
                        ref={listContainerRef}
                        className="space-y-2 overflow-y-auto max-h-[calc(60vh-120px)]"
                        style={draggedItem ? { touchAction: 'none' } : undefined}
                    >
                        {orderedItems.map((trackName, index) => {
                            const trackData = getTrackData(trackName);
                            const isVisible = visibleItems.includes(trackName);
                            const isDragged = draggedItem === trackName;

                            return (
                                <div key={trackName}>
                                    {placeholderIndex === index && (
                                        <div className="h-2 bg-teal-500 rounded-full mx-3 my-1 opacity-75 animate-pulse"></div>
                                    )}
                                    <div 
                                        data-track-name={trackName} 
                                        className={`flex justify-center items-center border-1 border-gray-700 rounded-2xl p-3 transition-all duration-200 ${
                                            isDragged ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
                                        }`}
                                    >
                                        <div onPointerDown={(e) => handlePointerDown(e, trackName)} style={{ touchAction: 'none' }}>
                                            <DotsVertical size={35} />
                                        </div>
                                        <div className="grow mx-2">
                                            <Label htmlFor={`select-${index}`}>
                                                <span className="text-gray-200 p-2">
                                                    {trackName}
                                                </span>
                                                  {trackData && (
                                                <div >
                                                    {trackData.chords.map((chord, index) => (
                                                        <span className="p-2 text-gray-400" key={index}>{chord}</span>
                                                    ))}
                                                </div>
                                            )}
                                            </Label>
                                          
                                        </div>
                                        <div className="">
                                            <Checkbox color="teal" className="h-6 w-6" id={`select-${index}`} defaultChecked checked={isVisible}
                                                onChange={(e) => { e.stopPropagation(); toggleItem(trackName); }} />
                                        </div>

                                    </div>
                                </div>
                            );
                        })}
                        {placeholderIndex === orderedItems.length && (
                            <div className="h-2 bg-teal-500 rounded-full mx-3 my-1 opacity-75 animate-pulse"></div>
                        )}
                    </div>
                </div>
            </DrawerItems>

            <HR />

            <div className="flex m-5 flex-wrap gap-2">
                <Button color="teal" pill onClick={onApply}>Close</Button>
            </div>
        </Drawer>
    );
}

