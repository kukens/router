'use client';

import { Drawer } from '@base-ui/react/drawer';
import { Button } from '@base-ui/react/button';
import { Input } from '@base-ui/react/input';
import { X } from 'lucide-react';
import { useEffect, useState } from "react";
import type { TrackData } from "~/types/TrackData";
import style from "./TagSelectorDrawer.module.css";

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
        <Drawer.Root>
            <Drawer.Trigger className="btn-action-alt">Select tags</Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Backdrop className="Backdrop" />
                <Drawer.Viewport className="Viewport">
                    <Drawer.Popup className="Popup">
                        <div className="Handle" />
                        <Drawer.Content className="Content">


                            <h2>Select tags</h2>

                            <div>
                                <Input value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="New tag" />
                                <Button onClick={addNewTag} className="btn-action-alt">Add new</Button>
                            </div>
                            <div className={style.tags}>
                                {allTags.map((tag, tagIndex) => (
                                    <Button key={tagIndex} className={`${tags.includes(tag) ? "btn-active" : "btn-inactive"}`} onClick={() => toggleTag(tag)}>
                                        {tag}
                                    </Button>
                                ))}
                            </div>


                            <div className="drawer-footer">
                                <Drawer.Close className="btn-action-alt" onClick={props.handleClose}>Cancel</Drawer.Close>
                                <Drawer.Close className="btn-action-alt" onClick={() => props.handleSave(tags)}>Save</Drawer.Close>
                            </div>


                        </Drawer.Content>
                    </Drawer.Popup>
                </Drawer.Viewport>
            </Drawer.Portal>

        </Drawer.Root>



    )
}
