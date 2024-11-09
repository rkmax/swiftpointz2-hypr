import {join} from "jsr:@std/path";

export const DEFAULT_CONFIG_PATH = join(new URL(".", import.meta.url).pathname, "config.json");


export type Config = {
    default: string;
    profiles: ProfileConfig[];
}

type ProfileConfig = {
    profile: string;
    class: string;
}

export async function configRead(configPath: string): Promise<Config> {
    const decoder = new TextDecoder();
    const data = await Deno.readFile(configPath);
    return JSON.parse(decoder.decode(data)) as Config;
}

export async function configWatcher(configPath: string, callback: (config: Config) => void) {
    const watcher = Deno.watchFs(configPath);

    for await (const event of watcher) {
        if (event.kind === "modify") {
            const config = await configRead(configPath);
            callback(config);
        }
    }
}