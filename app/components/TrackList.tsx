"use client";

import { useEffect, useState } from "react";
import type { TrackData } from "~/types/TrackData";
import { Button, HR } from "flowbite-react";
import { Link } from "react-router";
import OrderingDrawer from "~/components/OrderingDrawer";
import FilterDrawer from "~/components/FilterDrawer";

export const orderBy: Record<string, string> = {
  1: "Recently played",
  2: "Created",
  3: "Modified",
  4: "Most played",
} as const;

export default function TrackList() {
  const [rawTracks, setRawTracks] = useState<TrackData[]>([]);
  const [tracks, setTracks] = useState<TrackData[]>([]);
  const [visibleCount, setVisibleCount] = useState<number>(2);

  const [isOrderingOpen, setIsOrderingOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string>("1");

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterText, setFilterText] = useState<string>("");

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

    // apply filter (case-insensitive name contains)
    const filtered = rawTracks.filter((t) => {
      if (!filterText) return true;
      return (t.name ?? "").toLowerCase().includes(filterText.toLowerCase());
    });

    setTracks(sortTracks(filtered, selectedOrder));
    // reset visible count when ordering or filter changes
    setVisibleCount(2);
  }, [rawTracks, selectedOrder, filterText]);

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 2, tracks.length));
  };

  const allLoaded = visibleCount >= tracks.length;

  return (
    <div>
      <h2 className="dark:text-white text-center">My tracks:</h2>
      <HR />

      <div className="grid grid-cols-2 gap-2">
        <Button className="m-2" as="span" color="alternative" pill onClick={() => setIsOrderingOpen(true)}>
          Ordering
        </Button>
        <Button
          className="m-2"
          as="span"
          color={filterText ? "teal" : "alternative"}
          pill
          onClick={() => setIsFilterOpen(true)}
        >
          {filterText ? `Filter: ${filterText}` : "Filters"}
        </Button>
      </div>

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
        onClear={() => setFilterText("")}
      />

      {tracks.length === 0 && <p className="m-5 dark:text-white">No tracks found.</p>}

      {tracks.slice(0, visibleCount).map((track) => (
        <Link key={track.id} className="m-5" to={`/chord-tracks/${track.id}`}>
          <Button as="span" color="dark" pill>
            {track.name}
          </Button>
        </Link>
      ))}

      <div className="m-5">
        <Button
          className="m-2"
          as="span"
          color="alternative"
          pill
          onClick={loadMore}
          disabled={allLoaded || tracks.length === 0}
        >
          {allLoaded ? "All loaded" : "Load more"}
        </Button>

        <Link className="m-2" to="/chord-tracks/create">
          <Button as="span" color="teal" pill>
            Create track
          </Button>
        </Link>
      </div>
    </div>
  );
}