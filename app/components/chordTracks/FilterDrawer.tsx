"use client";

import { Drawer } from '@base-ui/react/drawer';
import { Button } from '@base-ui/react/button';
import { Input } from '@base-ui/react/input';
import React from "react";
import styles from "./FilterDrawer.module.css";
import { SlidersHorizontal } from 'lucide-react';

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filterText: string;
  onChangeFilter: (value: string) => void;
  onClear?: () => void;
  selectedTags?: string[];
  onChangeTags?: (tags: string[]) => void;
}

/**
 * Filter drawer (track name contains). `Apply` closes the drawer via `onClose`.
 * `Clear` clears filter text and also closes the drawer (calls onClear if provided).
 */
export default function FilterDrawer(props: FilterDrawerProps) {
  const { open, onClose, filterText, onChangeFilter, onClear, selectedTags, onChangeTags } = props;

  const [localTags, setLocalTags] = React.useState<string[]>(selectedTags || []);

  React.useEffect(() => {
    setLocalTags(selectedTags || []);
  }, [selectedTags]);

  // gather all existing tags from localStorage
  const [allTags, setAllTags] = React.useState<string[]>([]);
  React.useEffect(() => {
    const temp: string[] = [];
    for (const key in localStorage) {
      if (key?.startsWith("trackData")) {
        const value = localStorage.getItem(key) ?? "";
        try {
          const track = JSON.parse(value) as any;
          (track.tags || []).forEach((t: string) => { if (t && !temp.includes(t)) temp.push(t); });
        } catch {}
      }
    }
    setAllTags(temp);
  }, [open]);

  const toggleTag = (t: string) => {
    if (localTags.includes(t)) setLocalTags(localTags.filter(x => x !== t));
    else setLocalTags([...localTags, t]);
  }

  const handleClear = () => {
    onChangeFilter("");
    if (onClear) onClear();
    if (onChangeTags) onChangeTags([]);
    onClose();
  };

  return (

    <Drawer.Root>
      <Drawer.Trigger className="btn-action-alt">Filters <SlidersHorizontal size={15} /></Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Backdrop className="Backdrop" />
        <Drawer.Viewport className="Viewport">
          <Drawer.Popup className="Popup">
            <div className="Handle" />
            <Drawer.Content className="Content">

<h2>Filters</h2>


              <Input
                id="filter-name"
                placeholder="Chord track name..."
                value={filterText}
                onChange={(e) => onChangeFilter((e.target as HTMLInputElement).value)}
              />
   

          <div className={styles.tagSection}>
            <h3>Tags</h3>
            <div className={styles.tagList}>
              {allTags.map((tag, tagIndex) => (
                  <Button className={localTags.includes(tag) ? "btn-active" : "btn-inactive"} onClick={() => toggleTag(tag)}>
                  {tag}
                </Button>
              ))}
            </div>
          </div>
              <div className="drawer-footer">
                 <Button className="btn-action-alt" onClick={handleClear}>
                                                    Clear
                                                </Button>
                <Drawer.Close className="btn-action-alt" onClick={() => { if (onChangeTags) onChangeTags(localTags); onClose(); } }>Apply</Drawer.Close>
              </div>

            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>

    </Drawer.Root >
  );
}