"use client";

import styles from './WorkOut.module.css';
import type { Dispatch, SetStateAction } from 'react';
import { useState, useEffect } from 'react';
import TagsDrawer from "./TagsDrawer";
import ChordsDrawer from "./ChordsDrawer";
import FilteredItemsDrawer from "./FIlteredItemsDrawer";
import { WORKOUT_TRAKCS, type WorkOutTrack } from '~/data/workOutTracks';
import { useMemo } from 'react';
import { Button } from '@base-ui/react/button';
import { useFadeNavigate } from '~/components/RouteTransition';

import { Mic, Play, Settings, X } from 'lucide-react';

export default function () {
    const navigate = useFadeNavigate();
    const handleStartWorkout = () => {
        let playlist = finalFilteredItems;

        if (selectedChords.length === 0 && selectedTags.length === 0) {
            playlist = [...WORKOUT_TRAKCS];
            for (let i = playlist.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [playlist[i], playlist[j]] = [playlist[j], playlist[i]];
            }
        }

        localStorage.setItem('chordsArenaWorkOut', JSON.stringify(playlist));
        navigate('/workout/start');
    };

    const [isTagsDrawerOpen, setIsTagsDrawerOpen] = useState(false);
    const [isChordsDrawerOpen, setIsChordsDrawerOpen] = useState(false);
    const [selectedChords, setSelectedChords] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isItemsDrawerOpen, setIsItemsDrawerOpen] = useState(false);
    const [excludedItems, setExcludedItems] = useState<number[]>([]);
    const [reorderedFilteredItems, setReorderedFilteredItems] = useState<number[]>([]);


    const RemoveFilterItem = (value: string, setStateAction: Dispatch<SetStateAction<string[]>>) => {
        setStateAction((prev) =>
            prev.includes(value) ? prev.filter(i => i !== value) : [...prev, value]
        );
    }

    const filteredItems = useMemo<WorkOutTrack[]>(() => {
        return WORKOUT_TRAKCS.filter(item => {
            // chords: item must contain ALL selectedChords (AND)
            if (selectedChords.length > 0) {
                const hasAll = selectedChords.every(sc => item.chords.includes(sc));
                if (!hasAll) return false;
            }

            // tags: OR operator (at least one tag matches)
            if (selectedTags.length > 0) {
                const hasAnyTag = item.tags.some(t => selectedTags.includes(t));
                if (!hasAnyTag) return false;
            }

            return true;
        });
    }, [selectedChords, selectedTags]);

    const finalFilteredItems = useMemo<WorkOutTrack[]>(() => {
        const base: WorkOutTrack[] = filteredItems;

        // Apply ordering first (order is tracked over the full filtered list)
        const ordered: WorkOutTrack[] = reorderedFilteredItems.length > 0
            ? [
                ...reorderedFilteredItems
                    .map(itemId => base.find(item => item.id === itemId))
                    .filter((item): item is (typeof base)[number] => Boolean(item)),
                ...base.filter(item => !reorderedFilteredItems.includes(item.id)),
            ]
            : base;

        // Then apply exclusions
        return ordered.filter(i => !excludedItems.includes(i.id));
    }, [filteredItems, excludedItems, reorderedFilteredItems]);


    return (
        <>
            

                <div className={styles['filter-group']}>
                    <div className={styles['filter']}>
                        <ChordsDrawer isOpen={isChordsDrawerOpen} handleClose={() => setIsChordsDrawerOpen(false)} handleApply={(chords) => { setSelectedChords(chords); setIsChordsDrawerOpen(false); }} selected={selectedChords} selectedTags={selectedTags} ></ChordsDrawer>
                         <div className={styles.selectedFilters}>
                        {selectedChords.length > 0 &&
                           <>
                                {selectedChords.map(selectedChord => <Button className="btn-active" onClick={() => RemoveFilterItem(selectedChord, setSelectedChords)}>{selectedChord}<X size={15}  /></Button>)}
                           </>
                        }

                        {selectedChords.length === 0 &&
                             <Button className="btn-disabled">Any</Button>
                        }
                    </div>
                    </div>

                    <div className={styles['filter']}>

                        <TagsDrawer isOpen={isTagsDrawerOpen} handleClose={() => setIsTagsDrawerOpen(false)} handleApply={(value) => { setSelectedTags(value); setIsTagsDrawerOpen(false); }} selected={selectedTags} selectedChords={selectedChords} ></TagsDrawer>
                        <div className={styles.selectedFilters}>
                                {selectedTags.length > 0 &&
                                <>
                                        {selectedTags.map(tag => <Button className="btn-active" onClick={() => RemoveFilterItem(tag, setSelectedTags)}>{tag} <X size={15}  /></Button>)}
                                </>
                                }

                                {selectedTags.length === 0 &&
                                <Button className="btn-disabled">Any</Button>
                                }
                          </div>
                    </div>

             

                </div>

                <div className={styles['start-workout']}>

                    {finalFilteredItems.length === 0 &&
                    <p>No tracks found</p>
                    }

                    {finalFilteredItems.length > 0 &&
                    <div className={styles.itemsDrawer}>
                        {(selectedChords.length > 0 || selectedTags.length > 0) &&
                            <FilteredItemsDrawer
                                isOpen={isItemsDrawerOpen}
                                handleClose={() => setIsItemsDrawerOpen(false)}
                                items={filteredItems.map(i => i.id)}
                                excluded={excludedItems}
                                handleApply={(excluded, reorderedItems) => {
                                    setExcludedItems(excluded);
                                    setReorderedFilteredItems(reorderedItems);
                                    setIsItemsDrawerOpen(false);
                                }}
                                orderedItems={reorderedFilteredItems}
                                selectedCounter={finalFilteredItems.length}
                            />
                        }
                        <Button className="btn-action-alt btn-txt-icon">
                            <Settings size={18}/> Options
                        </Button>
                    </div>
                    }

                    {finalFilteredItems.length > 0 &&
                    <Button className="btn-action btn-txt-icon" onClick={handleStartWorkout}>
                       <Mic size={18} /> Start workout
                    </Button>
                    }
                </div>

        </>
    );
}
