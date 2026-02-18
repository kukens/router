"use client";

import { Drawer, DrawerHeader, DrawerItems, Radio, Button } from "flowbite-react";

interface OrderingDrawerProps {
  open: boolean;
  onClose: () => void;
  selectedOrder: string;
  onChangeOrder: (orderKey: string) => void;
  options: Record<string, string>;
}

/**
 * Lightweight ordering drawer — renders radio options passed in `options`.
 * Calls `onChangeOrder` when selection changes. `Apply` closes the drawer via `onClose`.
 */
export default function OrderingDrawer(props: OrderingDrawerProps) {
  const { open, onClose, selectedOrder, onChangeOrder, options } = props;

  return (
    <Drawer open={open} onClose={onClose} position="bottom">
      <DrawerHeader title="Ordering" />
      <DrawerItems>
        <div className="m-4 space-y-3">
          {Object.entries(options).map(([key, label]) => (
            <div key={key} className="flex items-center gap-2">
              <Radio
                id={`order-${key}`}
                name="ordering"
                value={key}
                checked={selectedOrder === key}
                onChange={() => onChangeOrder(key)}
              />
              <label htmlFor={`order-${key}`} className="dark:text-white">
                {label}
              </label>
            </div>
          ))}
        </div>
      </DrawerItems>

      <div className="border-t p-4 flex justify-end">
        <Button color="teal" pill onClick={onClose}>
          Apply
        </Button>
      </div>
    </Drawer>
  );
}