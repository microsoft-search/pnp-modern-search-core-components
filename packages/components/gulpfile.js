/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const gulp = require("gulp");
const fs = require("fs");

const versionFile = `
// THIS FILE IS AUTO GENERATED
// ANY CHANGES WILL BE LOST DURING BUILD
export const PACKAGE_VERSION = "[VERSION]";
`;

const setVersion = () => {
    const pkg = require("./package.json");
    fs.writeFileSync("./src/utils/version.ts", versionFile.replace("[VERSION]", pkg.version));
};

gulp.task("set-version", async () => setVersion());
