'use client';

import type { ReactNode } from 'react';
import { HandHeart, Info, Share2 } from 'lucide-react';
import { Drawer } from '@base-ui/react/drawer';
import styles from '~/components/Start.module.css';

function InfoDrawerContent() {
    return <div className={styles.emptyDrawer}><h2>Chords Arena</h2></div>;
}

function SupportDrawerContent() {
    return <div className={styles.emptyDrawer}><h2>Support us</h2></div>;
}

function ShareDrawerContent() {
    return <div className={styles.emptyDrawer}><h2>Share</h2></div>;
}

function FooterDrawer({ label, trigger, content }: { label: string; trigger: ReactNode; content: ReactNode }) {
    return (
        <Drawer.Root>
            <Drawer.Trigger type="button" className={styles.footerButton} aria-label={label}>
                {trigger}
            </Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Backdrop className="Backdrop" />
                <Drawer.Viewport className="Viewport">
                    <Drawer.Popup className="Popup">
                        <div className="Handle" />
                        <Drawer.Content className="Content">
                            {content}
                        </Drawer.Content>
                    </Drawer.Popup>
                </Drawer.Viewport>
            </Drawer.Portal>
        </Drawer.Root>
    );
}

export default function StartFooterDrawers() {
    return (
        <div className={styles.footer}>
            <FooterDrawer label="Open info drawer" trigger={<Info />} content={<InfoDrawerContent />} />
            <FooterDrawer label="Open support drawer" trigger={<HandHeart />} content={<SupportDrawerContent />} />
            <FooterDrawer label="Open share drawer" trigger={<Share2 />} content={<ShareDrawerContent />} />
        </div>
    );
}