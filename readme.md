# Swiftpoint Z2 Profile switcher for Hyprland

Deno-based application that automatically switches SwiftPoint Z2 mouse profiles based on active windows in the Hyprland window manager.

## Pre-requisites

- [Deno](https://deno.com/)
- [Hyprland](https://hyprland.org/)
- [SwiftPoint X1 Control panel](https://support.swiftpoint.com/portal/en/kb/articles/swiftpoint-x1-control-panel-download)

## Installation

```
git clone https://github.com/clone/SwiftPointZ2-Hypr.git
cd SwiftPointZ2-Hypr
```

## Configuration

Edit the `config.json` file to match your desired profiles

```json
{
  "default": "default_profile_name",
  "profiles": [
    {
      "profile": "profile_name",
      "class": "application_class"
    },
    ...
  ]
}
```

## Usage

Chose Active Profile as "Manual" and Enable the option "Allow profile switching via API" in the SwiftPoint X1 Control Panel

Run the application

```
deno run --allow-run --allow-read --allow-write --allow-env main.ts
```

## Additional Notes

Make sure your SwiftPoint Z2 mouse is connected and recognized by your system.
The application uses a Unix socket to communicate with the SwiftPoint Z2 mouse. Ensure that the socket path (`/tmp/swiftpoint.x1.profileswitch`) is correct for your system.

The application will listen for Hyprland [IPC](https://wiki.hyprland.org/IPC/) ensure that the IPC path is correct for your system. tested on Hyprland v0.44.1

The application watches for changes in the `config.json` file, so you can update the configuration without restarting the application.