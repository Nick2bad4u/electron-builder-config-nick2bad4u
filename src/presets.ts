import type { Configuration } from "electron-builder";

/** Named target collections offered by the package. */
export type ElectronBuilderPreset =
    | "base"
    | "extended"
    | "portable"
    | "recommended";

/** Minimal defaults with no platform targets. */
export const basePreset: Readonly<Configuration> = Object.freeze({
    asar: true,
    buildDependenciesFromSource: false,
    compression: "normal",
    directories: { output: "release" },
    files: [
        "dist/**/*",
        "!dist/**/*.map",
        "!dist/**/*.tsbuildinfo",
    ],
    npmRebuild: true,
    removePackageScripts: true,
});

/** A focused installer set suitable for most public desktop apps. */
export const recommendedPreset: Readonly<Configuration> =
    Object.freeze<Configuration>({
        linux: { target: ["AppImage", "deb"] },
        mac: { hardenedRuntime: true, target: ["dmg", "zip"] },
        win: { target: ["nsis", "portable"] },
    });

/** Single-file or archive-oriented outputs. */
export const portablePreset: Readonly<Configuration> =
    Object.freeze<Configuration>({
        linux: { target: ["AppImage"] },
        mac: { hardenedRuntime: true, target: ["zip"] },
        win: { target: ["portable"] },
    });

/** Broad package-manager coverage for projects that intentionally support it. */
export const extendedPreset: Readonly<Configuration> =
    Object.freeze<Configuration>({
        linux: {
            target: [
                "AppImage",
                "deb",
                "rpm",
                "snap",
                "freebsd",
                "pacman",
                "apk",
            ],
        },
        mac: {
            hardenedRuntime: true,
            target: [
                "dmg",
                "zip",
                "pkg",
            ],
        },
        win: {
            target: [
                "nsis",
                "nsis-web",
                "portable",
                "squirrel",
                "msi",
            ],
        },
    });

/** Fail closed when a release is expected to be signed and notarized. */
export const signedReleasePreset: Readonly<Configuration> = Object.freeze({
    forceCodeSigning: true,
    mac: {
        hardenedRuntime: true,
        notarize: true,
    },
});

/**
 * Explicit local-development policy that never masquerades as signed release
 * output.
 */
export const unsignedLocalPreset: Readonly<Configuration> = Object.freeze({
    forceCodeSigning: false,
    mac: {
        hardenedRuntime: false,
        identity: null,
        notarize: false,
    },
});

/**
 * Return a fresh preset object so consumer mutation cannot alter shared module
 * state.
 *
 * @throws When the preset name is unknown.
 */
export function getElectronBuilderPreset(
    preset: ElectronBuilderPreset
): Configuration {
    const candidate: unknown = preset;

    switch (candidate) {
        case "base": {
            return { ...basePreset };
        }
        case "extended": {
            return { ...extendedPreset };
        }
        case "portable": {
            return { ...portablePreset };
        }
        case "recommended": {
            return { ...recommendedPreset };
        }
        default: {
            throw new RangeError("Unknown electron-builder preset.");
        }
    }
}

export default recommendedPreset;
