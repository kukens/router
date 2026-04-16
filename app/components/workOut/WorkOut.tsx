"use client";

import styles from './WorkOut.module.css';
import type { Dispatch, SetStateAction } from 'react';
import { useState, useEffect } from 'react';
import DifficultyDrawer, { difficultyLevels } from "./DifficultyDrawer";
import TagsDrawer from "./TagsDrawer";
import ChordsDrawer from "./ChordsDrawer";
import FilteredItemsDrawer from "./FIlteredItemsDrawer";
import { WORKOUT_TRAKCS, type WorkOutTrack } from '~/data/workOutTracks';
import { useMemo } from 'react';
import { Link } from 'react-router';
import { Button } from '@base-ui/react/button';

import { X } from 'lucide-react';

export default function () {

    const [isDifficultyDrawerOpen, setIsDifficultyDrawerOpen] = useState(false);
    const [isTagsDrawerOpen, setIsTagsDrawerOpen] = useState(false);
    const [isChordsDrawerOpen, setIsChordsDrawerOpen] = useState(false);
    const [selectedChords, setSelectedChords] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedDifficultyLevels, setSelectedDifficultyLevels] = useState<string[]>([]);
    const [isItemsDrawerOpen, setIsItemsDrawerOpen] = useState(false);
    const [excludedItems, setExcludedItems] = useState<number[]>([]);
    const [reorderedFilteredItems, setReorderedFilteredItems] = useState<number[]>([]);


    const RemoveFilterItem = (value: string, setStateAction: Dispatch<SetStateAction<string[]>>) => {
        setStateAction((prev) =>
            prev.includes(value) ? prev.filter(i => i !== value) : [...prev, value]
        );
    }

    const selectedDifficultyNumbers = useMemo(() => {
        // map selected difficulty level labels back to numeric keys
        const map = Object.entries(difficultyLevels).reduce<Record<string, string>>((acc, [k, v]) => {
            acc[v] = k;
            return acc;
        }, {} as Record<string, string>);

        return selectedDifficultyLevels.map(l => Number(map[l])).filter(n => !Number.isNaN(n));
    }, [selectedDifficultyLevels]);

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

            // difficulty: OR operator (any selected difficulty)
            if (selectedDifficultyNumbers.length > 0) {
                if (!selectedDifficultyNumbers.includes(item.difficulty)) return false;
            }

            return true;
        });
    }, [selectedChords, selectedTags, selectedDifficultyNumbers]);

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
                        <ChordsDrawer isOpen={isChordsDrawerOpen} handleClose={() => setIsChordsDrawerOpen(false)} handleApply={(chords) => { setSelectedChords(chords); setIsChordsDrawerOpen(false); }} selected={selectedChords} selectedTags={selectedTags} selectedDifficultyLevels={selectedDifficultyLevels} ></ChordsDrawer>

                        {selectedChords.length > 0 &&
                            <div className={styles['active-filters']}>
                                {selectedChords.map(selectedChord => <Button className="btn-active" onClick={() => RemoveFilterItem(selectedChord, setSelectedChords)}>{selectedChord}<X size={15}  /></Button>)}
                            </ div>
                        }

                        {selectedChords.length === 0 &&
                            <div> <Button className="btn-disabled">Any</Button></ div>
                        }
                    </div>

                    <div className={styles['filter']}>

                        <TagsDrawer isOpen={isTagsDrawerOpen} handleClose={() => setIsTagsDrawerOpen(false)} handleApply={(value) => { setSelectedTags(value); setIsTagsDrawerOpen(false); }} selected={selectedTags} selectedChords={selectedChords} selectedDifficultyLevels={selectedDifficultyLevels} ></TagsDrawer>

                        {selectedTags.length > 0 &&
                            <div className="">
                                {selectedTags.map(tag => <Button className="btn-active" onClick={() => RemoveFilterItem(tag, setSelectedTags)}>{tag} <X size={15}  /></Button>)}
                            </ div>
                        }

                        {selectedTags.length === 0 &&
                            <div className=""> <Button className="btn-disabled">Any</Button></ div>
                        }
                    </div>

                    <div className={styles['filter']}>

                        <DifficultyDrawer isOpen={isDifficultyDrawerOpen} handleClose={() => setIsDifficultyDrawerOpen(false)} handleApply={(value) => { setSelectedDifficultyLevels(value); setIsDifficultyDrawerOpen(false); }} selected={selectedDifficultyLevels} selectedChords={selectedChords} selectedTags={selectedTags} ></DifficultyDrawer>

                        {selectedDifficultyLevels.length > 0 &&
                            <div className="">
                                {selectedDifficultyLevels.map(difficultyLevel => <Button className="btn-active" onClick={() => RemoveFilterItem(difficultyLevel, setSelectedDifficultyLevels)}>{difficultyLevel} <X size={15}  /></Button>)}
                            </ div>
                        }

                        {selectedDifficultyLevels.length === 0 &&
                            <div className=""> <Button className="btn-disabled">Any</Button></ div>
                        }
                    </div>
                </div>

                <div className={styles['start-workout']}>
                    {finalFilteredItems.length === 0 && 
                    <p>No items found </p>
                    }

                    {finalFilteredItems.length > 0 && 
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

   

                    <Link to="/workout/start" state={{ WorkOutTracks: finalFilteredItems }}>
                        <Button className="btn-action" onClick={() => console.log(finalFilteredItems.map(i => i.id))}>Start Workout</Button>
                    </Link>
                </div>
      
        </>
    );
}
