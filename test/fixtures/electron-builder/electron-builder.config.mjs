import { createElectronBuilderConfig } from "../../../dist/electron-builder-config.js";

export default createElectronBuilderConfig({
    appId: "io.example.electron-builder-smoke",
    directories: { output: "release-smoke" },
    overrides: { npmRebuild: false },
    preset: "portable",
    productName: "Electron Builder Smoke",
});
