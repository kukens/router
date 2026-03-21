"use client";

import { Drawer, DrawerHeader, DrawerItems, Radio, Button } from "flowbite-react";
import styles from "./OrderingDrawer.module.css";

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
        <div className={styles.options}>
          {Object.entries(options).map(([key, label]) => (
            <div key={key} className={styles.optionRow}>
              <Radio
                id={`order-${key}`}
                name="ordering"
                value={key}
                checked={selectedOrder === key}
                onChange={() => onChangeOrder(key)}
              />
              <label htmlFor={`order-${key}`} className={styles.optionLabel}>
                {label}
              </label>
            </div>
          ))}
        </div>
      </DrawerItems>

      <div className={styles.actions}>
        <Button color="teal" pill onClick={onClose}>
          Apply
        </Button>
      </div>
    </Drawer>
  );
}