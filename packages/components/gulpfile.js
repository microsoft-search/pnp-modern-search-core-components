/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const gulp = require("gulp");
const fs = require("fs");

const versionFile = `
// THIS FILE IS AUTO GENERATED
// ANY CHANGES WILL BE LOST DURING BUILD
export const PACKAGE_VERSION = "[VERSION]";
`;

const setVersion = (version) => {
    fs.writeFileSync("./src/utils/version.ts", versionFile.replace("[VERSION]", version));
};

gulp.task("set-version", async () => {

    const versionArg = process.argv.indexOf("--semver");
    const version = process.argv[versionArg+1];

    setVersion(version);
});
