import type { Config } from "@react-router/dev/config";

export default {
  // This app is fully client-side (localStorage/audio APIs), so emit a static
  // SPA build instead of a server-rendered React Router build.
  ssr: false,

  // Include the full route manifest in the initial document so navigation does
  // not request /__manifest when links/buttons are clicked.
  routeDiscovery: { mode: "initial" },
} satisfies Config;
