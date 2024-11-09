#!/usr/bin/env -S deno run --allow-read --allow-write --allow-run --allow-env --allow-net

import { Config, configRead, configWatcher, DEFAULT_CONFIG_PATH } from "./config.ts";
import { ActiveWindowHyprlandEvent, HyprlandEvent, onHyprlandEvent } from "./hypr.ts";
import { setSwiftpointProfile } from "./swiftpoint.ts";


async function main() {
    let config = await configRead(DEFAULT_CONFIG_PATH);

    console.debug("Starting Hyprland event listener");

    await Promise.all([
        configWatcher(DEFAULT_CONFIG_PATH, (updatedConfig) => {
            config = updatedConfig;
        }),
        onHyprlandEvent(event => {
            processEvent(event, config);
        })
    ]);
}

function processEvent(event: HyprlandEvent, config: Config) {
    switch (event.event) {
        case "activewindow":
            processActiveWindow(event as ActiveWindowHyprlandEvent, config);
            break;
        default:
            break;
    }
}

function processActiveWindow(event: ActiveWindowHyprlandEvent, config: Config) {
    console.debug(`Active window: ${event.data.class}`);
    const profile = config.profiles.find(p => p.class === event.data.class);
    setSwiftpointProfile(profile?.profile ?? config.default);
}

if (import.meta.main) {
    main()
    .catch((error) => {
        console.error(error);
        Deno.exit(1);
    });
}