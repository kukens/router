import { type RouteConfig, route, index, layout, prefix } from "@react-router/dev/routes";

export default [
    index("routes/index.tsx"),
    route("quick-jam", "routes/quick-jam/index.tsx"),
    route("quick-jam/start", "routes/quick-jam/start/index.tsx"),
    route("chord-tracks", "routes/chord-tracks/index.tsx"),
    route("chord-tracks/create", "routes/chord-tracks/create/index.tsx"),
    route("chord-tracks/:id/", "routes/chord-tracks/[id]/index.tsx"),
    route("chord-tracks/:id/edit", "routes/chord-tracks/[id]/edit/index.tsx"),
    route("chord-tracks/:id/play", "routes/chord-tracks/[id]/play/index.tsx"),
    route("learning-path", "routes/learning-path/index.tsx"),
] satisfies RouteConfig;
