# Security Policy

## Supported versions

Only the latest release (**0.1.1**) receives security fixes.

| Version | Supported |
| ------- | --------- |
| 0.1.1   | ✅        |
| < 0.1.1 | ❌        |

## Reporting a vulnerability

Please **do not** open a public issue for security problems.

Report vulnerabilities privately by email to **jmicaux@gmail.com**, or via GitHub's
[private vulnerability reporting](https://github.com/jmicaux/wow-armory/security/advisories/new).

Include:
- a description of the issue and its impact,
- steps to reproduce (or a proof of concept),
- the affected version and browser.

You can expect an acknowledgement within a few days. Once a fix is available, a new
release will be published and the advisory disclosed.

## Scope

This extension reads public character data from the Raider.IO API and item tooltips from
Wowhead. It uses no Blizzard/Raider.IO credentials and stores only your form preferences
and cached responses locally. Reports about Raider.IO, Wowhead or Blizzard services
themselves are out of scope.
