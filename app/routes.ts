import { type RouteConfig, route, index, layout, prefix } from "@react-router/dev/routes";

export default [
    index("routes/index.tsx"),
    route("challenge", "routes/challenge/index.tsx"),
    route("challenge/start", "routes/challenge//start/index.tsx"),
    route("tracks/create", "routes/tracks/create/index.tsx"),
    route("tracks/:id/", "routes/tracks/[id]/index.tsx"),
    route("tracks/:id/edit", "routes/tracks/[id]/edit/index.tsx"),
    route("tracks/:id/play", "routes/tracks/[id]/play/index.tsx"),
] satisfies RouteConfig;
