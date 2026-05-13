# WoW Armory Lite

Cross-browser WebExtension rebuild inspired by the old Netvibes WoW Armory widget.

The original UWA widget disappeared with the shutdown of netvibes.com. This rebuild relies on the public Raider.IO character profile API and runs as a browser extension.

## Features

- Browser action popup
- Region / realm / character form
- Saved preferences with `storage.sync`
- Character class/spec/race/faction summary
- Guild, equipped item level, achievement points and current Mythic+ score
- Link to Raider.IO profile
- Options page
- Chrome and Firefox compatible WebExtension structure

## Local testing

### Chrome / Chromium

1. Open `chrome://extensions`
2. Enable Developer mode
3. Click "Load unpacked"
4. Select this `wow-armory` folder

### Firefox

1. Open `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select `manifest.json`

## Notes

Default character inspired by the official WoW profile URL shared during recovery:

- Region: `eu`
- Realm: `archimonde`
- Character: `Poilgrês`

The extension does not use Blizzard API credentials. Data availability depends on Raider.IO.
When Raider.IO has no public data for the configured character, the popup falls back to a direct link to the official World of Warcraft Armory profile.
