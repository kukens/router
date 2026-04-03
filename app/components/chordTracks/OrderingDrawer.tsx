"use client";

import { Drawer } from '@base-ui/react/drawer';
import { Radio } from '@base-ui/react/radio';
import { Button } from '@base-ui/react/button';
import styles from "./OrderingDrawer.module.css";
import { RadioGroup } from '@base-ui/react';
import radioStyles from "~/theme/Radio.module.css";
import { ArrowDownUp } from 'lucide-react';

interface OrderingDrawerProps {
  open: boolean;
  onClose: () => void;
  selectedOrder: string;
  onChangeOrder: (orderKey: string) => void;
  options: Record<string, string>;
}

export default function OrderingDrawer(props: OrderingDrawerProps) {
  const { open, onClose, selectedOrder, onChangeOrder, options } = props;

  return (
    <Drawer.Root>
      <Drawer.Trigger className="btn-action-alt">Ordering <ArrowDownUp  size={15} color='#999' /></Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Backdrop className="Backdrop" />
        <Drawer.Viewport className="Viewport">
          <Drawer.Popup className="Popup">
            <div className="Handle" />
            <Drawer.Content className="Content">
              <div className={styles.container}>
                <h2 id="storage-type-label">Ordering</h2>
                <div className={styles.options}>

                  <RadioGroup aria-labelledby="storage-type-label" defaultValue={selectedOrder} className={radioStyles.RadioGroup} onValueChange={(v) => onChangeOrder(v)}>
                    {Object.entries(options).map(([key, label]) => (
                      <label key={key} className={radioStyles.Item} data-key={selectedOrder}>
                        <Radio.Root className={radioStyles.Radio} id={`order-${key}`} value={key}>
                          <Radio.Indicator className={radioStyles.Indicator} />
                        </Radio.Root>
                        {label}
                      </label>
                    ))}

                  </RadioGroup>
                </div>
              </div>
              <div className="drawer-footer">
                <Drawer.Close className="btn-action-alt" onClick={onClose}>Apply</Drawer.Close>
              </div>

            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>

    </Drawer.Root >

  );
}