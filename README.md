# electron-builder-config-nick2bad4u

[![Continuous Integration](https://github.com/Nick2bad4u/electron-builder-config-nick2bad4u/actions/workflows/ci.yml/badge.svg)](https://github.com/Nick2bad4u/electron-builder-config-nick2bad4u/actions/workflows/ci.yml)

Typed [electron-builder](https://www.electron.build/configuration/) factories for portable, recommended, extended, locally unsigned, and signed desktop release policies. Application identity and publishing are always explicit.

## Install

```sh
npm install --save-dev electron-builder electron-builder-config-nick2bad4u
```

## Recommended configuration

```ts
// electron-builder.config.ts
import {
 createElectronBuilderConfig,
 createGitHubPublishConfig,
} from "electron-builder-config-nick2bad4u";

export default createElectronBuilderConfig({
 appId: "io.example.desktop",
 icons: {
  linux: "assets/icon.png",
  mac: "assets/icon.icns",
  windows: "assets/icon.ico",
 },
 productName: "Example Desktop",
 publisher: createGitHubPublishConfig({
  owner: "example",
  repo: "example-desktop",
 }),
});
```

Without `publisher`, the generated config does not publish anywhere.

## Target presets

| Preset        | Windows                                 | macOS         | Linux                                          | Intended use                                 |
| ------------- | --------------------------------------- | ------------- | ---------------------------------------------- | -------------------------------------------- |
| `base`        | None                                    | None          | None                                           | Bring your own targets                       |
| `recommended` | NSIS, portable                          | DMG, ZIP      | AppImage, DEB                                  | Most public desktop apps                     |
| `portable`    | Portable                                | ZIP           | AppImage                                       | Small archive/single-file matrix             |
| `extended`    | NSIS, web NSIS, portable, Squirrel, MSI | DMG, ZIP, PKG | AppImage, DEB, RPM, Snap, FreeBSD, Pacman, APK | Projects prepared to support every toolchain |

The `extended` preset is intentionally opt-in: individual targets require host tools, signing infrastructure, or package-specific metadata.

```ts
import { createElectronBuilderConfig } from "electron-builder-config-nick2bad4u";

export default createElectronBuilderConfig({
 appId: "io.example.portable",
 preset: "portable",
 productName: "Example Portable",
});
```

## Signing policy

`signedReleasePreset` enables `forceCodeSigning`, hardened macOS runtime, and notarization. It fails closed when signing is expected but unavailable. `unsignedLocalPreset` explicitly disables signing discovery for development builds. Neither preset contains credentials or identities.

```ts
import {
 createElectronBuilderConfig,
 mergeElectronBuilderConfigs,
 signedReleasePreset,
} from "electron-builder-config-nick2bad4u";

const base = createElectronBuilderConfig({
 appId: "io.example.app",
 productName: "Example App",
});

export default mergeElectronBuilderConfigs(base, signedReleasePreset);
```

## Artifact names

The helpers return literal electron-builder macros:

```ts
import {
 createArtifactName,
 createTargetArtifactName,
} from "electron-builder-config-nick2bad4u/artifacts";

createArtifactName("Example App");
// Example-App-${platform}-${arch}-${version}.${ext}

createTargetArtifactName("Example App", "nsis");
// Example-App-nsis-${arch}-${version}.${ext}
```

## Overrides and merging

The root factory merges `directories`, `linux`, `mac`, `nsis`, and `win` objects. Arrays such as `files` and platform `target` lists replace earlier values. This keeps target selection deliberate rather than silently building extra installers.

## Validation

```sh
npm run release:verify
```

Validation covers option errors, target/publisher policy, signed-versus-local separation, public types and exports, npm packaging, and a real `electron-builder --dir --publish never` consumer smoke build.
