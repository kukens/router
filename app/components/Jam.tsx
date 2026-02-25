"use client";

import type { Dispatch, SetStateAction } from 'react';
import { Button } from "flowbite-react";
import { HR } from "flowbite-react";
import { useState, useEffect } from 'react';
import DifficultyDrawer, { difficultyLevels } from "./Jam/DifficultyDrawer";
import TagsDrawer from "./Jam/TagsDrawer";
import ChordsDrawer from "./Jam/ChordsDrawer";
import FilteredItemsDrawer from "./Jam/FIlteredItemsDrawer";
import { WORKOUT_TRAKCS } from '~/data/workOutTracks';
import { useMemo } from 'react';

export default function () {

    const [isDifficultyDrawerOpen, setIsDifficultyDrawerOpen] = useState(false);
    const [isTagsDrawerOpen, setIsTagsDrawerOpen] = useState(false);
    const [isChordsDrawerOpen, setIsChordsDrawerOpen] = useState(false);
    const [selectedChords, setSelectedChords] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedDifficultyLevels, setSelectedDifficultyLevels] = useState<string[]>([]);
    const [isItemsDrawerOpen, setIsItemsDrawerOpen] = useState(false);
    const [excludedItems, setExcludedItems] = useState<string[]>([]);


    const RemoveFilterItem = (value: string, setStateAction: Dispatch<SetStateAction<string[]>>) => {
        setStateAction((prev) =>
            prev.includes(value)? prev.filter(i => i !== value) : [...prev, value]
        );
    }

    const selectedDifficultyNumbers = useMemo(() => {
        // map selected difficulty level labels back to numeric keys
        const map = Object.entries(difficultyLevels).reduce<Record<string,string>>((acc, [k, v]) => {
            acc[v] = k;
            return acc;
        }, {} as Record<string,string>);

        return selectedDifficultyLevels.map(l => Number(map[l])).filter(n => !Number.isNaN(n));
    }, [selectedDifficultyLevels]);

    const filteredItems = useMemo(() => {
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

    const finalFilteredItems = useMemo(() => filteredItems.filter(i => !excludedItems.includes(i.name)), [filteredItems, excludedItems]);


    return (
        <div>
            <Button className="m-5" as="span" color="light" pill onClick={() => setIsChordsDrawerOpen(true)}>Select chords  {selectedChords.length > 0 && selectedChords.length}  </Button>

            {selectedChords.length > 0 &&
                <div className="flex flex-wrap">
                    {selectedChords.map(selectedChord => <Button className="m-2" as="span" color="alternative" pill onClick={() => RemoveFilterItem(selectedChord, setSelectedChords)}>{selectedChord}</Button>)}
                </ div>
            }

            {selectedChords.length === 0 &&
                <div className="flex gap-2"> <Button as="span" color="alternative" pill>Any</Button></ div>
            }

            <Button className="m-5" as="span" color="light" pill onClick={() => setIsTagsDrawerOpen(true)}>Select tags</Button>

            {selectedTags.length > 0 &&
                <div className="flex flex-wrap">
                    {selectedTags.map(tag => <Button className="m-2" as="span" color="alternative" pill onClick={() => RemoveFilterItem(tag, setSelectedTags)}>{tag}</Button>)}
                </ div>
            }

            {selectedTags.length === 0 &&
                <div className="flex gap-2"> <Button className="m-2" as="span" color="alternative" pill>Any</Button></ div>
            }

            <Button className="m-5" as="span" color="light" pill onClick={() => setIsDifficultyDrawerOpen(true)} >Select difficulty</Button>

            {selectedDifficultyLevels.length > 0 &&
                <div className="flex flex-wrap">
                    {selectedDifficultyLevels.map(difficultyLevel => <Button className="m-2" as="span" color="alternative" pill onClick={() => RemoveFilterItem(difficultyLevel, setSelectedDifficultyLevels)}>{difficultyLevel}</Button>)}
                </ div>
            }

            {selectedDifficultyLevels.length === 0 &&
                <div className="flex gap-2"> <Button className="m-2" as="span" color="alternative" pill>Any</Button></ div>
            }

          

            <Button className="m-5" as="span" color="light" pill onClick={() => setIsItemsDrawerOpen(true)}>
                { (selectedChords.length > 0 || selectedTags.length > 0 || selectedDifficultyLevels.length > 0) ? `${finalFilteredItems.length} items found` : `${WORKOUT_TRAKCS.length} items found` }
            </Button>

            <Button className="m-5" as="span" color="teal" pill onClick={() => console.log(finalFilteredItems.map(i => i.name))}>Start Workout</Button>

            <ChordsDrawer isOpen={isChordsDrawerOpen} handleClose={() => setIsChordsDrawerOpen(false)} handleApply={(chords) => { setSelectedChords(chords); setIsChordsDrawerOpen(false); }} selected={selectedChords} selectedTags={selectedTags} selectedDifficultyLevels={selectedDifficultyLevels} ></ChordsDrawer>

            <TagsDrawer isOpen={isTagsDrawerOpen} handleClose={() => setIsTagsDrawerOpen(false)} handleApply={(value) => { setSelectedTags(value); setIsTagsDrawerOpen(false); }} selected={selectedTags} selectedChords={selectedChords} selectedDifficultyLevels={selectedDifficultyLevels} ></TagsDrawer>

            <DifficultyDrawer isOpen={isDifficultyDrawerOpen} handleClose={() => setIsDifficultyDrawerOpen(false)} handleApply={(value) => { setSelectedDifficultyLevels(value); setIsDifficultyDrawerOpen(false); }} selected={selectedDifficultyLevels} selectedChords={selectedChords} selectedTags={selectedTags} ></DifficultyDrawer>
            <FilteredItemsDrawer isOpen={isItemsDrawerOpen} handleClose={() => setIsItemsDrawerOpen(false)} selected={finalFilteredItems.map(i => i.name)} handleApply={(value) => { setExcludedItems(value); setIsItemsDrawerOpen(false); }} />
        </div>
    );
}
