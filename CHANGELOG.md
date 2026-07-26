# Changelog

All notable changes to WoW Armory Lite are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and the project adheres to [Semantic Versioning](https://semver.org/).

## [0.1.1] — 2026-07-26

### Added
- Version number shown in the popup footer (read from the extension manifest).
- Interactive live-preview page for the project (simulated browser + real popup).

### Changed
- Documentation aligned with the other jmicaux projects (badges, license, credits).

## [0.1.0] — Initial release

### Added
- Browser-action popup with a region / realm / character form.
- Character summary from the public Raider.IO profile API: class, spec, race,
  faction, guild, equipped item level, achievement points and current Mythic+ score.
- Equipment breakdown with Wowhead item tooltips (cached locally for 14 days).
- Saved preferences via `storage.sync`; profile responses cached for 30 minutes
  with a short cooldown on forced refreshes.
- Fallback to the official World of Warcraft Armory profile when Raider.IO has no
  public data for the character.
- Options page and a Chrome / Firefox compatible WebExtension structure
  (single MV3 manifest with `browser_specific_settings.gecko`).

[0.1.1]: https://github.com/jmicaux/wow-armory/releases/tag/v0.1.1
[0.1.0]: https://github.com/jmicaux/wow-armory/releases/tag/v0.1.0
