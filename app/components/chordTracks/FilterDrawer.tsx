"use client";

import { Drawer, DrawerHeader, DrawerItems, TextInput, Button } from "flowbite-react";
import React from "react";

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
    <Drawer open={open} onClose={onClose} position="bottom">
      <DrawerHeader title="Filter tracks" />
      <DrawerItems>
        <div className="m-4">
          <label className="block mb-2 dark:text-white">Track name contains</label>
          <TextInput
            id="filter-name"
            placeholder="Enter part of a track name"
            value={filterText}
            onChange={(e) => onChangeFilter((e.target as HTMLInputElement).value)}
          />

          <div className="mt-4">
            <label className="block mb-2 dark:text-white">Tags</label>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag, tagIndex) => (
                  <Button key={tagIndex} color="dark" outline={localTags.includes(tag)} pill onClick={() => toggleTag(tag)}>
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </DrawerItems>

      <div className="border-t p-4 flex gap-2 justify-end">
        <Button color="gray" pill onClick={handleClear}>
          Clear
        </Button>
        <Button color="teal" pill onClick={() => { if (onChangeTags) onChangeTags(localTags); onClose(); }}>
          Apply
        </Button>
      </div>
    </Drawer>
  );
}