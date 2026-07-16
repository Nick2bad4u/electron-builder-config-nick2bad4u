import { describe, expect, it } from "vitest";

import {
    createArtifactMacro,
    createArtifactName,
    createElectronBuilderConfig,
    createGitHubPublishConfig,
    createTargetArtifactName,
    getElectronBuilderPreset,
    mergeElectronBuilderConfigs,
    signedReleasePreset,
    unsignedLocalPreset,
} from "../src/electron-builder-config.js";

describe("artifact helpers", () => {
    it("preserves electron-builder macros literally", () => {
        expect.assertions(3);

        expect(createArtifactMacro("version")).toBe("${version}");
        expect(createArtifactName("Example App")).toBe(
            "Example-App-${platform}-${arch}-${version}.${ext}"
        );
        expect(createTargetArtifactName("Example App", "nsis web")).toBe(
            "Example-App-nsis-web-${arch}-${version}.${ext}"
        );
    });

    it("rejects empty artifact segments", () => {
        expect.assertions(2);
        expect(() => createArtifactName(" ")).toThrow(TypeError);
        expect(() => createTargetArtifactName("Example", "")).toThrow(
            TypeError
        );
    });
});

describe("publisher helper", () => {
    it("creates an explicit GitHub publisher", () => {
        expect.assertions(1);
        expect(
            createGitHubPublishConfig({
                owner: "Nick2bad4u",
                releaseType: "release",
                repo: "Example-App",
            })
        ).toStrictEqual({
            owner: "Nick2bad4u",
            provider: "github",
            releaseType: "release",
            repo: "Example-App",
        });
    });

    it("rejects missing repository identity", () => {
        expect.assertions(1);
        expect(() =>
            createGitHubPublishConfig({ owner: "Nick2bad4u", repo: " " })
        ).toThrow(TypeError);
    });
});

describe("configuration factories", () => {
    it("builds a recommended config without publishing", () => {
        expect.assertions(7);

        const config = createElectronBuilderConfig({
            appId: "io.example.desktop",
            icons: {
                linux: "assets/icon.png",
                mac: "assets/icon.icns",
                windows: "assets/icon.ico",
            },
            productName: "Example Desktop",
        });

        expect(config.appId).toBe("io.example.desktop");
        expect(config.productName).toBe("Example Desktop");
        expect(config.publish).toBeUndefined();
        expect(config.linux?.target).toStrictEqual(["AppImage", "deb"]);
        expect(config.mac?.hardenedRuntime).toBe(true);
        expect(config.win?.icon).toBe("assets/icon.ico");
        expect(config.artifactName).toContain("${platform}");
    });

    it("keeps portable and extended target choices distinct", () => {
        expect.assertions(3);
        expect(getElectronBuilderPreset("portable").win?.target).toStrictEqual([
            "portable",
        ]);
        expect(getElectronBuilderPreset("extended").linux?.target).toContain(
            "rpm"
        );
        expect(() => getElectronBuilderPreset("unknown" as "base")).toThrow(
            RangeError
        );
    });

    it("separates signed release and unsigned local policy", () => {
        expect.assertions(4);
        expect(signedReleasePreset.forceCodeSigning).toBe(true);
        expect(signedReleasePreset.mac?.notarize).toBe(true);
        expect(unsignedLocalPreset.forceCodeSigning).toBe(false);
        expect(unsignedLocalPreset.mac?.hardenedRuntime).toBe(false);
    });

    it("replaces target and file arrays while merging platform objects", () => {
        expect.assertions(3);

        const merged = mergeElectronBuilderConfigs(
            {
                files: ["dist/**/*"],
                win: { icon: "old.ico", target: ["nsis"] },
            },
            {
                files: ["app/**/*"],
                win: { target: ["portable"] },
            }
        );

        expect(merged.files).toStrictEqual(["app/**/*"]);
        expect(merged.win?.icon).toBe("old.ico");
        expect(merged.win?.target).toStrictEqual(["portable"]);
    });

    it("validates required and final identity", () => {
        expect.assertions(2);
        expect(() =>
            createElectronBuilderConfig({ appId: "", productName: "Example" })
        ).toThrow(TypeError);
        expect(() =>
            createElectronBuilderConfig({
                appId: "io.example.app",
                overrides: { productName: "" },
                productName: "Example",
            })
        ).toThrow(TypeError);
    });
});
