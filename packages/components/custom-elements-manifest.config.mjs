export default {
    /** Globs to analyze */
    globs: ["src/**/*.ts"],
    /** Globs to exclude */
    exclude: ["storybook-static","stories","node_modules"],
    /** Directory to output CEM to */
    outdir: ".",
    /** Run in dev mode, provides extra logging */
    dev: true,
    /** Run in watch mode, runs on file changes */
    watch: false,
    /** Include third party custom elements manifests */
    dependencies: false,
    /** Output CEM path to `package.json`, defaults to true */
    packagejson: false,
    /** Enable special handling for litelement */
    litelement: true,
    /** Enable special handling for catalyst */
    catalyst: false,
    /** Enable special handling for fast */
    fast: false,
    /** Enable special handling for stencil */
    stencil: false,
    /** Provide custom plugins */
    plugins: [
    ]
};