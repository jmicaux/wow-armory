# Contributing to WoW Armory Lite

Thanks for your interest in improving WoW Armory Lite! This is a small, dependency-free
WebExtension — contributions that keep it simple are very welcome.

## Getting started

No build step and no dependencies. Clone the repo and load it directly:

**Chrome / Chromium**
1. Open `chrome://extensions`, enable **Developer mode**.
2. **Load unpacked** → select the project folder.

**Firefox**
1. Open `about:debugging#/runtime/this-firefox`.
2. **Load Temporary Add-on** → select `manifest.json`.

The live-preview page (`index.html`) runs the real popup as a plain web page (via a
`localStorage` storage shim), handy for iterating on the UI without reloading the extension.

## Coding conventions

- **Vanilla JavaScript**, no framework, no build tooling, no runtime dependencies.
- A single MV3 `manifest.json` targets both Chrome and Firefox
  (`browser_specific_settings.gecko`) — keep it cross-browser.
- Match the existing style (2-space indent, single quotes, small focused functions).
- Untrusted third-party HTML (e.g. Wowhead tooltips) must be parsed inertly, never
  injected into the live DOM via `innerHTML`.

## Submitting changes

1. Create a feature branch from `main`.
2. Keep the change focused and describe the *why* in the PR.
3. Bump `version` in `manifest.json` and add a `CHANGELOG.md` entry for user-facing changes.
4. Repackage the `dist/` artifacts if you change shipped files.

## Reporting bugs

Open a [GitHub issue](https://github.com/jmicaux/wow-armory/issues) with steps to
reproduce, your browser/version, and the character (region/realm/name) involved. For
security issues, see [SECURITY.md](SECURITY.md) instead.

## License

By contributing, you agree that your contributions are licensed under the
[PolyForm Noncommercial License 1.0.0](LICENSE.md) — noncommercial use only.
