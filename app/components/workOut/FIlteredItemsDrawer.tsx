

"use client";
import { Checkbox } from '@base-ui/react/checkbox';
import { Button } from "@base-ui/react";
import { Drawer } from "@base-ui/react";
import { useState, useEffect, useRef } from "react";
import { WORKOUT_TRAKCS } from "../../data/workOutTracks";
import { DotsVertical } from "flowbite-react-icons/outline";
import styles from './FIlteredItemsDrawer.module.css'
import { Check, Grip } from "lucide-react";

interface FilteredItemsDrawerProps {
    isOpen: boolean
    items: number[] // all item ids in the drawer (including excluded)
    excluded: number[] // currently excluded item ids
    handleClose: () => void;
    // on apply we return array of excluded item names and the new order
    handleApply: (excludedIds: number[], newOrder: number[]) => void;
    orderedItems: number[] // the current order of items,
    selectedCounter: number; // number of currently selected items (after exclusion)
}

export default function FilteredItemsDrawer(props: FilteredItemsDrawerProps) {
    const [visibleItems, setVisibleItems] = useState<number[]>(props.items);
    const [orderedItems, setOrderedItems] = useState<number[]>(props.items);
    const [draggedItem, setDraggedItem] = useState<number | null>(null);
    const [placeholderIndex, setPlaceholderIndex] = useState<number | null>(null);

    const listContainerRef = useRef<HTMLDivElement | null>(null);
    const dragStateRef = useRef<{ itemId: number; pointerId: number } | null>(null);
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

    const toggleItem = (id: number) => {
        setVisibleItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    }

    const onApply = () => {
        const excluded = props.items.filter(id => !visibleItems.includes(id));
        props.handleApply(excluded, orderedItems);
    }

    const computePlaceholderIndex = (clientY: number, draggingId: number) => {
        const container = listContainerRef.current;
        if (!container) return;

        const itemElements = Array.from(container.querySelectorAll<HTMLElement>('[data-track-id]'));
        const visibleItemElements = itemElements.filter(el => Number(el.getAttribute('data-track-id')) !== draggingId);

        for (let i = 0; i < visibleItemElements.length; i++) {
            const rect = visibleItemElements[i].getBoundingClientRect();
            const midY = rect.top + rect.height / 2;
            if (clientY < midY) {
                const idAttr = visibleItemElements[i].getAttribute('data-track-id');
                if (!idAttr) return;
                const id = Number(idAttr);
                const idx = orderedItems.indexOf(id);
                const nextIndex = idx === -1 ? null : idx;
                placeholderIndexRef.current = nextIndex;
                setPlaceholderIndex(nextIndex);
                return;
            }
        }

        placeholderIndexRef.current = orderedItems.length;
        setPlaceholderIndex(orderedItems.length);
    };

    const finalizeReorder = (draggingId: number, insertIndex: number | null) => {
        if (insertIndex === null) return;
        const from = orderedItems.indexOf(draggingId);
        if (from === -1) return;

        const next = [...orderedItems];
        next.splice(from, 1);
        const adjusted = from < insertIndex ? insertIndex - 1 : insertIndex;
        next.splice(adjusted, 0, draggingId);
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
                computePlaceholderIndex(clientY, dragState.itemId);
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

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, itemId: number) => {
        if (e.pointerType !== 'touch' && e.pointerType !== 'pen' && e.pointerType !== 'mouse') return;
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);

        dragStateRef.current = { itemId, pointerId: e.pointerId };
        setDraggedItem(itemId);
        lastClientYRef.current = e.clientY;
        computePlaceholderIndex(e.clientY, itemId);
        updateAutoScrollSpeed(e.clientY);

        const onMove = (ev: PointerEvent) => {
            if (!dragStateRef.current) return;
            if (ev.pointerId !== dragStateRef.current.pointerId) return;
            ev.preventDefault();
            lastClientYRef.current = ev.clientY;
            computePlaceholderIndex(ev.clientY, dragStateRef.current.itemId);
            updateAutoScrollSpeed(ev.clientY);
        };

        const onUp = (ev: PointerEvent) => {
            if (!dragStateRef.current) return;
            if (ev.pointerId !== dragStateRef.current.pointerId) return;

            const { itemId: draggingId } = dragStateRef.current;
            finalizeReorder(draggingId, placeholderIndexRef.current);

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

    const resetOrder = () => {
        // exclude none (keep all)
        props.handleApply([], orderedItems);
    }

    const getTrackData = (trackId: number) => {
        return WORKOUT_TRAKCS.find(track => track.id === trackId);
    }

    return (

        <Drawer.Root>
            <Drawer.Trigger className="btn-action-alt">{props.selectedCounter} items selected</Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Backdrop className="Backdrop" />
                <Drawer.Viewport className="Viewport">

                    <Drawer.Popup className="Popup">
                        <div className="Handle" />
                        <Drawer.Content className="Content">
                            <div className="drawer-header"><h2>Adjust Workout</h2></div>
                            <div data-base-ui-swipe-ignore
                                ref={listContainerRef}
                                className={styles.scrollable}
                                style={draggedItem ? { touchAction: 'none' } : undefined}
                            >
                                {orderedItems.map((trackId, index) => {
                                    const trackData = getTrackData(trackId);
                                    const isVisible = visibleItems.includes(trackId);
                                    const isDragged = draggedItem === trackId;

                                    return (
                                        <div key={trackId} className={`${isVisible ? '' : styles.deselected}`}>
                                            {placeholderIndex === index && (
                                                <div className={styles.placeholderBar}></div>
                                            )}
                                            <div data-track-id={trackId}
                                                className={styles.result}
                                                style={isDragged ? { opacity: 0.5, transform: 'scale(0.95)' } : { opacity: 1, transform: 'scale(1)' }}>

                                                <label htmlFor={`select-${index}`} className={styles.resultLabel}>

                                                    <div className={`${styles.checkboxWrapper}`}>
                                                        <Checkbox.Root id={`select-${index}`} defaultChecked checked={isVisible} onCheckedChange={(e) => toggleItem(trackId)} className="Checkbox">
                                                            <Checkbox.Indicator className="Indicator">
                                                                <Check />
                                                            </Checkbox.Indicator>
                                                        </Checkbox.Root>
                                                    </div>

                                                    <div className={styles[`result-content`]}>
                                                        <span className={styles[`result-name`]}>
                                                            {trackData?.name ?? String(trackId)}
                                                        </span>
                                                        {trackData && (
                                                            <div className={styles.chords}>
                                                                {trackData.chords.map((chord, index) => (
                                                                    <span className={styles.chord} key={index}>{chord}</span>
                                                                ))}
                                                            </div>
                                                        )}

                                                    </div>
                                                </label>

                                                <div className={styles.dragger} onPointerDown={(e) => handlePointerDown(e, trackId)}>
                                                    <Grip />
                                                </div>

                                            </div>

                                        </div>

                                    );
                                })}
                                {placeholderIndex === orderedItems.length && (
                                    <div className={styles.placeholderBar}></div>
                                )}
                            </div>
                            <div className="drawer-footer">
                                <Button className="btn-action-alt" onClick={resetOrder}>Reset order</Button>
                                <Drawer.Close className="btn-action-alt" onClick={onApply}>Apply</Drawer.Close>
                            </div>

                        </Drawer.Content>
                    </Drawer.Popup>

                </Drawer.Viewport>
            </Drawer.Portal>

        </Drawer.Root>


    );
}

