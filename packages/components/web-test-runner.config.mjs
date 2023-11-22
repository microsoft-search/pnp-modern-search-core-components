import { puppeteerLauncher } from "@web/test-runner-puppeteer";
import { esbuildPlugin } from "@web/dev-server-esbuild";
import { fileURLToPath } from "url";

// https://modern-web.dev/docs/test-runner/cli-and-configuration/
export default {
  files: ["./src/**/*/*.test.ts"],
  nodeResolve: true,
  testsFinishTimeout: 240000,
  concurrentBrowsers: 3,
  concurrency: 10,
  browsers: [puppeteerLauncher({ concurrency: 3 })],
  testFramework: {
    // https://mochajs.org/api/mocha
    config: {
      ui: "bdd",
      timeout: "60000",
    },
  },
  plugins: [
    // https://modern-web.dev/docs/dev-server/plugins/esbuild/
    esbuildPlugin({
      ts: true,
      tsconfig: fileURLToPath(new URL("./tsconfig.json", import.meta.url))
    })
  ],
};