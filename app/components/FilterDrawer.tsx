"use client";

import { Drawer, DrawerHeader, DrawerItems, TextInput, Button } from "flowbite-react";
import React from "react";

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filterText: string;
  onChangeFilter: (value: string) => void;
  onClear?: () => void;
}

/**
 * Filter drawer (track name contains). `Apply` closes the drawer via `onClose`.
 * `Clear` clears filter text and also closes the drawer (calls onClear if provided).
 */
export default function FilterDrawer(props: FilterDrawerProps) {
  const { open, onClose, filterText, onChangeFilter, onClear } = props;

  const handleClear = () => {
    onChangeFilter("");
    if (onClear) onClear();
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
        </div>
      </DrawerItems>

      <div className="border-t p-4 flex gap-2 justify-end">
        <Button color="gray" pill onClick={handleClear}>
          Clear
        </Button>
        <Button color="teal" pill onClick={onClose}>
          Apply
        </Button>
      </div>
    </Drawer>
  );
}