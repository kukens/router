"use client";

import { useEffect, useState } from "react";
import type { TrackData } from "../../types/TrackData";
import { Button } from '@base-ui/react/button';
import OrderingDrawer from "./OrderingDrawer";
import FilterDrawer from "./FilterDrawer";
import styles from "./TrackList.module.css";
import { ChevronRight, X } from 'lucide-react';
import { useFadeNavigate } from '~/components/RouteTransition';

export const orderBy: Record<string, string> = {
    1: "Recently played",
    2: "Created",
    3: "Modified",
    4: "Most played",
} as const;

export default function TrackList() {
    const navigate = useFadeNavigate();
    const [rawTracks, setRawTracks] = useState<TrackData[]>([]);
    const [tracks, setTracks] = useState<TrackData[]>([]);
    const [visibleCount, setVisibleCount] = useState<number>(2);

    const [isOrderingOpen, setIsOrderingOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<string>("1");

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterText, setFilterText] = useState<string>("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    useEffect(() => {
        const tempTracks: TrackData[] = [];

        for (const key in localStorage) {
            if (key?.startsWith("trackData")) {
                const value = localStorage.getItem(key) ?? "";
                try {
                    const track = JSON.parse(value) as TrackData;
                    tempTracks.push(track);
                } catch {
                    // ignore invalid json
                }
            }
        }

        setRawTracks(tempTracks);
        // apply initial ordering / visibility
        setVisibleCount(2);
    }, []);

    // filter + sort whenever rawTracks, selectedOrder or filterText changes
    useEffect(() => {
        const sortTracks = (list: TrackData[], orderKey: string) => {
            const cloned = [...list];
            const getNumber = (t: any, prop: string) => {
                if (!t) return 0;
                const v = (t as any)[prop];
                if (!v) return 0;
                const n = Number(v);
                if (!isNaN(n)) return n;
                const parsed = Date.parse(v);
                return isNaN(parsed) ? 0 : parsed;
            };

            switch (orderKey) {
                case "1": // Recently played
                    return cloned.sort(
                        (a: any, b: any) =>
                            getNumber(b, "lastPlayed") - getNumber(a, "lastPlayed") || a.name.localeCompare(b.name)
                    );
                case "2": // Created
                    return cloned.sort(
                        (a: any, b: any) => getNumber(b, "createdAt") - getNumber(a, "createdAt") || a.name.localeCompare(b.name)
                    );
                case "3": // Modified
                    return cloned.sort(
                        (a: any, b: any) => getNumber(b, "modifiedAt") - getNumber(a, "modifiedAt") || a.name.localeCompare(b.name)
                    );
                case "4": // Most played
                    return cloned.sort(
                        (a: any, b: any) => (b.playCount ?? 0) - (a.playCount ?? 0) || a.name.localeCompare(b.name)
                    );
                default:
                    return cloned.sort((x, y) => x.name.localeCompare(y.name));
            }
        };

        // apply filter (case-insensitive name contains) and tag filters
        const filtered = rawTracks.filter((t) => {
            if (filterText && !(t.name ?? "").toLowerCase().includes(filterText.toLowerCase())) return false;

            if (selectedTags && selectedTags.length > 0) {
                const trackTags = (t.tags || []).map(x => x.toLowerCase().trim());
                // require that track contains any of the selected tags (case-insensitive OR semantics)
                return selectedTags
                    .map(x => x.toLowerCase().trim())
                    .some((st) => trackTags.includes(st));
            }

            return true;
        });

        setTracks(sortTracks(filtered, selectedOrder));
        // reset visible count when ordering or filter changes
        setVisibleCount(2);
    }, [rawTracks, selectedOrder, filterText, selectedTags]);

    const loadMore = () => {
        setVisibleCount((prev) => Math.min(prev + 2, tracks.length));
    };

    const allLoaded = visibleCount >= tracks.length;

    const isFilterTextApplied = () => {
        if (filterText?.length > 0) {
            return 1;
        }

        return 0;
    }

    return (
        <div className={styles.container}>
            <OrderingDrawer
                open={isOrderingOpen}
                onClose={() => setIsOrderingOpen(false)}
                selectedOrder={selectedOrder}
                onChangeOrder={(k) => setSelectedOrder(k)}
                options={orderBy}
            />

            <FilterDrawer
                open={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                filterText={filterText}
                onChangeFilter={(v) => setFilterText(v)}
                onClear={() => { setFilterText(""); setSelectedTags([]); }}
                selectedTags={selectedTags}
                onChangeTags={(ts: string[]) => setSelectedTags(ts)}
            />

            <div>
                {filterText &&
                    <Button className="btn-active" onClick={() => setFilterText("")}>Text: {filterText}  <X size={15} /></Button>}

                {selectedTags.length > 0 &&
                    selectedTags.map(tag =>
                        <Button key={tag} className="btn-active" onClick={() => setSelectedTags(prev => prev.filter(_ => _ !== tag))}>Tag: {tag}
                            <X size={15} />
                        </Button>)
                }
            </div>


            {tracks.length === 0 && <p className={styles.emptyState}>No tracks found.</p>}

            <div className={styles.trackList}>
                {tracks.slice(0, visibleCount).map((track, index) => (
                    <Button key={track.id} className={`${styles.trackLink}`} onClick={() => navigate(`/chord-tracks/${track.id}`)}>
                        <div className={`${styles.chordTrackCard}`}>
                            <h2 className={styles.trackName}>{track.name} <ChevronRight /></h2>
                            <div className={styles.trackDetails}>
                                <div className={styles.metadata}>
                                     <span>{track.tempo} BPM</span>
                                     <span>{track.bars.length} bars</span>
                                </div>

                            {track.tags && track.tags.length > 0 && 
                                  <div className={styles.tags}>
                                    {track.tags.map((tag, index) => (
                                        <Button key={index} className="btn-disabled">{tag}</Button>
                                    ))}
                                </div>
                           }
                            </div>

                        </div>
                    </Button>
                ))}
            </div>

            <div className={styles.footerActions}>
                {!allLoaded &&
                    <Button className="btn-action-alt" onClick={loadMore} disabled={allLoaded || tracks.length === 0}>
                        Load more
                    </Button>
                }

            </div>
        </div>
    );
}