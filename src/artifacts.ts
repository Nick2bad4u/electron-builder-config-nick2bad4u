import { arrayJoin, isDefined } from "ts-extras";

/** Electron-builder file-name macros supported by the shared helpers. */
export type ElectronBuilderArtifactMacro =
    | "arch"
    | "channel"
    | "ext"
    | "name"
    | "os"
    | "platform"
    | "productName"
    | "version";

const macro = (name: ElectronBuilderArtifactMacro): string => `\${${name}}`;

const normalizeSegment = (value: string, label: string): string => {
    const normalized = value.trim().replaceAll(/\s+/gv, "-");
    if (!normalized) {
        throw new TypeError(`${label} must not be empty.`);
    }
    return normalized;
};

/** Return one literal electron-builder macro such as `${version}`. */
export function createArtifactMacro(
    name: ElectronBuilderArtifactMacro
): string {
    return macro(name);
}

/** Create a cross-platform artifact template. */
export function createArtifactName(prefix: string, variant?: string): string {
    const segments = [normalizeSegment(prefix, "Artifact prefix")];
    if (isDefined(variant)) {
        segments.push(normalizeSegment(variant, "Artifact variant"));
    }
    segments.push(macro("platform"), macro("arch"), macro("version"));
    return `${arrayJoin(segments, "-")}.${macro("ext")}`;
}

/** Create a target-specific artifact template without repeating the platform. */
export function createTargetArtifactName(
    prefix: string,
    target: string
): string {
    return `${normalizeSegment(prefix, "Artifact prefix")}-${normalizeSegment(target, "Artifact target")}-${macro("arch")}-${macro("version")}.${macro("ext")}`;
}

export default createArtifactName;
