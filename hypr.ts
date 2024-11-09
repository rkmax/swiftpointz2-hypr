const HYPRLAND_SOCKET_PATH = `${Deno.env.get("XDG_RUNTIME_DIR")}/hypr/${Deno.env.get("HYPRLAND_INSTANCE_SIGNATURE")}/.socket2.sock`;

type OnHyprlandEvent = (event: HyprlandEvent) => void;


export type HyprlandEvent = ActiveWindowHyprlandEvent | ActiveWindowV2HyprlandEvent | FocusedMonHyprlandEvent | OtherHyprlandEvent;

type OtherHyprlandEvent = {
    raw: string;
    event: string;
    data: unknown;
}

export type ActiveWindowHyprlandEvent = {
    raw: string;
    event: "activewindow";
    data: {
        class: string;
        title: string;
    }
}

type ActiveWindowV2HyprlandEvent = {
    raw: string
    event: "activewindowv2";
    data: {
        id: string;
    }
}

type FocusedMonHyprlandEvent = {
    raw: string;
    event: "focusedmon";
    data: {
        monitor: string;
        workspace: string;
    }
}

export async function onHyprlandEvent(onHyprlandEvent: OnHyprlandEvent) {
    const conn = await Deno.connect({ transport: "unix", path: HYPRLAND_SOCKET_PATH });
    const decoder = new TextDecoder();
    const buf = new Uint8Array(1024);
    while (true) {
        const n = await conn.read(buf);
        if (n === null) {
            break;
        }
        const event = decoder.decode(buf.subarray(0, n));
        const parsedEvents = paseHyprlandEvents(event);
        parsedEvents.forEach(onHyprlandEvent);
    }
}

function paseHyprlandEvents(events: string): HyprlandEvent[] {
    console.debug(`Parsing events: ${events}`);
    const eventStrings = events.split("\n");
    return eventStrings.filter(Boolean).map(parseHyprlandEvent);
}

function parseHyprlandEvent(eventString: string): HyprlandEvent {
    const [name, data] = eventString.split(">>");
    const dataParts = data.split(",");

    switch (name) {
        case 'focusedmon':
            return {
                event: name,
                raw: eventString,
                data: {
                    monitor: dataParts[0],
                    workspace: dataParts[1]
                }
            }
        case 'activewindow':
            return {
                event: name,
                raw: eventString,
                data: {
                    class: dataParts[0],
                    title: dataParts[1]
                }
            }
        case 'activewindowv2':
            return {
                event: name,
                raw: eventString,
                data: {
                    id: dataParts[0]
                }
            }
        default:
            return {
                event: name,
                raw: eventString,
                data: dataParts
            }
    }
}

if (import.meta.main) {
    onHyprlandEvent((event) => {
        console.log(event);
    })
    .catch((e) => {
        console.error(`Failed to connect to Hyprland socket: ${e}`, e.stack);
    });
}