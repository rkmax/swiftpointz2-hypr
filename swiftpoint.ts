const SWIFTPOINT_Z2_SOCKET_PATH = "/tmp/swiftpoint.x1.profileswitch";

export async function setSwiftpointProfile(profile: string) {
  try {
    const conn = await Deno.connect({ transport: "unix", path: SWIFTPOINT_Z2_SOCKET_PATH });
    const encoder = new TextEncoder();
    await conn.write(encoder.encode(profile));
  } catch (e) {
    if (e instanceof Error) {
        console.error(`Failed to connect to Swiftpoint Z2 socket: ${e}`, e.stack);
    }
  }
}
