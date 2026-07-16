# Repository Instructions

This repository publishes `electron-builder-config-nick2bad4u`.
Treat every factory, preset, artifact template, publisher helper, and option type as a public package surface.

## Priorities

- Require application identity explicitly; never ship consumer paths or repository metadata as defaults.
- Keep publishing disabled unless a consumer supplies a publisher.
- Keep local unsigned and signed release policy visibly separate.
- Treat target arrays as replacement values and merge only documented nested platform objects.
- Validate package contents and a real electron-builder directory smoke build before release.

## Commands

```sh
npm run build:runtime
npm run typecheck
npm test
npm run release:verify
```
