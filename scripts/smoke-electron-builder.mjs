import { spawnSync } from "node:child_process";
import { rm } from "node:fs/promises";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(
    fileURLToPath(new URL("..", import.meta.url))
);
const fixtureRoot = path.join(
    repositoryRoot,
    "test",
    "fixtures",
    "electron-builder"
);
const outputDirectory = path.join(fixtureRoot, "release-smoke");
const cliPath = path.join(
    repositoryRoot,
    "node_modules",
    "electron-builder",
    "out",
    "cli",
    "cli.js"
);

await rm(outputDirectory, { force: true, recursive: true });

try {
    const result = spawnSync(
        process.execPath,
        [
            cliPath,
            "--config",
            "electron-builder.config.mjs",
            "--dir",
            "--publish",
            "never",
        ],
        {
            cwd: fixtureRoot,
            encoding: "utf8",
            env: { ...process.env, CSC_IDENTITY_AUTO_DISCOVERY: "false" },
            stdio: "inherit",
        }
    );

    if (result.error) {
        throw result.error;
    }
    if (result.status !== 0) {
        throw new Error(
            `electron-builder smoke test exited with status ${String(result.status)}.`
        );
    }
} finally {
    await rm(outputDirectory, { force: true, recursive: true });
}
