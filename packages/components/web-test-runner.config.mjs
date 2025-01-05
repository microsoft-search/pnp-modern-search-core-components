import { puppeteerLauncher } from "@web/test-runner-puppeteer";
import puppeteer from "puppeteer";
import { esbuildPlugin } from "@web/dev-server-esbuild";
import { fileURLToPath } from "url";

console.log("puppeteer executablePath is :" + puppeteer.executablePath());

// https://modern-web.dev/docs/test-runner/cli-and-configuration/
export default {
  files: ["./src/**/*/*.test.ts"],
  nodeResolve: true,
  testsFinishTimeout: 240000,
  concurrentBrowsers: 3,
  concurrency: 10,
  browsers: [puppeteerLauncher({ concurrency: 3, launchOptions: {
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox'
    ],
    executablePath: puppeteer.executablePath()
  }  })],
  testFramework: {
    // https://mochajs.org/api/mocha
    config: {
      ui: "bdd",
      timeout: "90000",
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