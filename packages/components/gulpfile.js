/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const gulp = require("gulp");
const fs = require("fs");
const replace = require("gulp-replace");
const { src, dest } = require("gulp");
const rename = require("gulp-rename");

const versionFile = `
// THIS FILE IS AUTO GENERATED
// ANY CHANGES WILL BE LOST DURING BUILD
export const PACKAGE_VERSION = "[VERSION]";
`;

const envFile = `
// THIS FILE IS AUTO GENERATED
// ANY CHANGES WILL BE LOST DURING BUILD
export const CLIENTID = "[CLIENT_ID]";
export const TENANT_ID = "[TENANT_ID]"
export const DOMAIN_HINT = "[DOMAIN_HINT]";
export const PROFILES_SOURCE_ID = "[PROFILES_SOURCE_ID]"
export const DIST_HOST_URL = "https://[STORAGE_ACCOUNT_NAME].blob.core.windows.net/dist"
`;

const setVersion = () => {
    const pkg = require("./package.json");
    fs.writeFileSync("./src/utils/version.ts", versionFile.replace("[VERSION]", pkg.version));
};

const setStorybookEnv = () => {

    const clientId = process.argv[process.argv.indexOf("--clientId") + 1];
    const tenantId = process.argv[process.argv.indexOf("--tenantId") + 1];
    const domainHint = process.argv[process.argv.indexOf("--domainHint") + 1];
    const profilesSourceId = process.argv[process.argv.indexOf("--profilesSourceId") + 1];
    const storageAccount = process.argv[process.argv.indexOf("--storageAccount") + 1];

    fs.writeFileSync("./.storybook/addons/env.ts", 
        envFile.replace("[CLIENT_ID]", clientId)
        .replace("[TENANT_ID]", tenantId)
        .replace("[DOMAIN_HINT]", domainHint)
        .replace("[PROFILES_SOURCE_ID]", profilesSourceId)
        .replace("[STORAGE_ACCOUNT_NAME]", storageAccount)
    );
};

gulp.task("set-version", async () => setVersion());
gulp.task("set-storybook-env", async () => setStorybookEnv());

gulp.task("update-assets-url", async () => {

    const hostUrlArg = process.argv.indexOf("--hosturl");
    const hostUrl = process.argv[hostUrlArg+1];
  
    return src("assets/**/*.template.json")
        .pipe(replace("{{ASSETS_HOST_URL}}", hostUrl))
        .pipe(rename((path) => {
            return {
              dirname: path.dirname,
              basename: path.basename.replace(".template",""),
              extname: ".json"
            };
          }))
        .pipe(dest("./assets/"));
  });