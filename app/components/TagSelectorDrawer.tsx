'use client';

import { Button, Drawer, DrawerHeader, DrawerItems, TextInput, CloseIcon } from "flowbite-react";
import { useEffect, useState } from "react";
import type { TrackData } from "~/types/TrackData";

interface TagSelectorDrawerProps {
    isOpen: boolean;
    selectedTags: string[];
    handleClose: () => void;
    handleSave: (tags: string[]) => void;
}

export default function TagSelectorDrawer(props: TagSelectorDrawerProps) {

    const [allTags, setAllTags] = useState<string[]>([]);
    const [tags, setTags] = useState<string[]>(props.selectedTags || []);
    const [newTag, setNewTag] = useState("");

    useEffect(() => {
        const temp: string[] = [];

        for (const key in localStorage) {
            if (key?.startsWith("trackData")) {
                const value = localStorage.getItem(key) ?? "";

                    const track = JSON.parse(value) as TrackData;
                    track.tags?.forEach(t => { if (t && !temp.includes(t)) temp.push(t); });
            }
        }

        setAllTags([...new Set([...temp, ...props.selectedTags])]);

    }, [props.isOpen]);

    useEffect(() => {
        setTags(props.selectedTags || []);
    }, [props.selectedTags]);

    const toggleTag = (tag: string) => {
        if (tags.includes(tag)) {
            setTags(tags.filter(t => t !== tag));
        } else {
            setTags([...tags, tag]);
        }
    }

    const addNewTag = () => {
        const tag = newTag.trim();

        if (!tag) {
            return;
        }

        if (!tags.includes(tag)) {
            setTags([...tags, tag]);
        }

        if (!allTags.includes(tag)) {
            setAllTags([...allTags, tag]);
        }

        setNewTag("");
    }

    return (
        <Drawer open={props.isOpen} onClose={props.handleClose} position="bottom">
            <DrawerHeader title="Select tags" titleIcon={() => <></>} />
            <DrawerItems>
                <div className="m-5">
                    <p className="dark:text-white mb-3">Available tags:</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {allTags.map((tag, tagIndex) => (
                            <Button key={tagIndex} color="dark" outline={tags.includes(tag)} pill onClick={() => toggleTag(tag)}>
                                {tag}
                            </Button>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <TextInput value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="New tag" />
                        <Button onClick={addNewTag} color="teal">Add new</Button>
                    </div>


                </div>
            </DrawerItems>

            <div className="m-5">
                <div className="flex gap-2">
                    <Button color="teal" onClick={() => props.handleSave(tags)}>Save</Button>
                    <Button color="light" onClick={props.handleClose}>Cancel</Button>
                </div>
            </div>
        </Drawer>
    )
}
