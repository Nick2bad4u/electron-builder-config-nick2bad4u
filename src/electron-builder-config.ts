/**
 * Typed electron-builder configuration factories.
 *
 * @packageDocumentation
 */

import type { Configuration } from "electron-builder";

import { isDefined } from "ts-extras";

import type { GitHubPublishConfig } from "./github.js";

import { createArtifactName, createTargetArtifactName } from "./artifacts.js";
import {
    basePreset,
    type ElectronBuilderPreset,
    getElectronBuilderPreset,
} from "./presets.js";

export * from "./artifacts.js";
export * from "./github.js";
export * from "./presets.js";

/** Options for the complete electron-builder factory. */
export interface ElectronBuilderConfigOptions {
    readonly appId: string;
    readonly artifactPrefix?: string;
    readonly directories?: Configuration["directories"];
    readonly executableName?: string;
    readonly files?: Configuration["files"];
    readonly icons?: ElectronBuilderIcons;
    readonly overrides?: Configuration;
    readonly preset?: ElectronBuilderPreset;
    readonly productName: string;
    readonly publisher?: GitHubPublishConfig;
}

/** Platform icon paths supplied by the consuming app. */
export interface ElectronBuilderIcons {
    readonly linux?: string;
    readonly mac?: string;
    readonly windows?: string;
}

const assertNonEmpty = (value: string, label: string): string => {
    const normalized = value.trim();
    if (!normalized) {
        throw new TypeError(`${label} must not be empty.`);
    }
    return normalized;
};

/**
 * Create a complete config while keeping app identity explicit.
 *
 * @throws When app identity is empty or a selected preset is unknown.
 */
export function createElectronBuilderConfig(
    options: ElectronBuilderConfigOptions
): Configuration {
    const appId = assertNonEmpty(options.appId, "Application ID");
    const productName = assertNonEmpty(options.productName, "Product name");
    const artifactPrefix =
        options.artifactPrefix ?? productName.replaceAll(/\s+/gv, "-");
    const selected = getElectronBuilderPreset(options.preset ?? "recommended");

    let config = mergeElectronBuilderConfigs(basePreset, selected);
    config = mergeElectronBuilderConfigs(config, {
        appId,
        artifactName: createArtifactName(artifactPrefix),
        ...(isDefined(options.directories) && {
            directories: options.directories,
        }),
        executableName: options.executableName ?? productName,
        ...(isDefined(options.files) && { files: options.files }),
        linux: {
            ...config.linux,
            ...(isDefined(options.icons?.linux) && {
                icon: options.icons.linux,
            }),
        },
        mac: {
            ...config.mac,
            artifactName: createTargetArtifactName(artifactPrefix, "mac"),
            ...(isDefined(options.icons?.mac) && { icon: options.icons.mac }),
        },
        ...(isDefined(options.publisher) && { publish: [options.publisher] }),
        productName,
        win: {
            ...config.win,
            ...(isDefined(options.icons?.windows) && {
                icon: options.icons.windows,
            }),
        },
    });

    if (isDefined(options.overrides)) {
        config = mergeElectronBuilderConfigs(config, options.overrides);
    }

    assertNonEmpty(config.appId ?? "", "Final application ID");
    assertNonEmpty(config.productName ?? "", "Final product name");
    return config;
}

/**
 * Merge documented nested configuration objects; target and file arrays
 * replace.
 */
export function mergeElectronBuilderConfigs(
    base: Configuration,
    overrides: Configuration
): Configuration {
    const hasDirectories =
        isDefined(base.directories) || isDefined(overrides.directories);
    const hasLinux = isDefined(base.linux) || isDefined(overrides.linux);
    const hasMac = isDefined(base.mac) || isDefined(overrides.mac);
    const hasNsis = isDefined(base.nsis) || isDefined(overrides.nsis);
    const hasWindows = isDefined(base.win) || isDefined(overrides.win);

    return {
        ...base,
        ...overrides,
        ...(hasDirectories && {
            directories: { ...base.directories, ...overrides.directories },
        }),
        ...(hasLinux && { linux: { ...base.linux, ...overrides.linux } }),
        ...(hasMac && { mac: { ...base.mac, ...overrides.mac } }),
        ...(hasNsis && { nsis: { ...base.nsis, ...overrides.nsis } }),
        ...(hasWindows && { win: { ...base.win, ...overrides.win } }),
    };
}

export default createElectronBuilderConfig;
