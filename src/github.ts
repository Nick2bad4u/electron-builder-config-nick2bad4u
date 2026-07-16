import { isDefined } from "ts-extras";

/** GitHub publishing configuration accepted by electron-builder. */
export interface GitHubPublishConfig {
    readonly owner: string;
    readonly private?: boolean;
    readonly provider: "github";
    readonly releaseType?: GitHubReleaseType;
    readonly repo: string;
    readonly vPrefixedTagName?: boolean;
}

/** Options for a GitHub publisher. */
export interface GitHubPublisherOptions {
    readonly owner: string;
    readonly private?: boolean;
    readonly releaseType?: GitHubReleaseType;
    readonly repo: string;
    readonly vPrefixedTagName?: boolean;
}

/** Supported GitHub release visibility values. */
export type GitHubReleaseType =
    | "draft"
    | "prerelease"
    | "release";

const assertIdentifier = (value: string, label: string): string => {
    const normalized = value.trim();
    if (!normalized) {
        throw new TypeError(`${label} must not be empty.`);
    }
    return normalized;
};

/** Build an explicit GitHub publisher; no preset publishes by default. */
export function createGitHubPublishConfig(
    options: GitHubPublisherOptions
): GitHubPublishConfig {
    return {
        owner: assertIdentifier(options.owner, "GitHub owner"),
        ...(isDefined(options.private) && { private: options.private }),
        provider: "github",
        ...(isDefined(options.releaseType) && {
            releaseType: options.releaseType,
        }),
        repo: assertIdentifier(options.repo, "GitHub repository"),
        ...(isDefined(options.vPrefixedTagName) && {
            vPrefixedTagName: options.vPrefixedTagName,
        }),
    };
}

export default createGitHubPublishConfig;
