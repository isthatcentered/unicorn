// import resolve from 'rollup-plugin-node-resolve';
// import commonjs from 'rollup-plugin-commonjs';
import json from "rollup-plugin-json";
import resolve from "rollup-plugin-node-resolve";
import common from "rollup-plugin-commonjs";
import pkg from "./package.json";
import { dirname } from "path";
// import typescript from 'rollup-plugin-typescript';
import ts from "@wessberg/rollup-plugin-ts";
import notify from "rollup-plugin-notify";
import sizes from "rollup-plugin-sizes";
import visualizer from "rollup-plugin-visualizer";

// https://rollupjs.org/guide/en/#creating-your-first-bundle
// https://devhints.io/rollup
export default {
  input: pkg.source,
  // https://rollupjs.org/guide/en/#peer-dependencies
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {})
  ],
  // https://rollupjs.org/guide/en/#using-plugins
  plugins: [
    /**
     * https://rollupjs.org/guide/en/#with-npm-packages
     * Without this, rollup doesn't know haow to import cjs modules,
     * (The resulting bundle.js will still work in Node.js, because the import declaration gets turned into a
     * CommonJS require statement, but the-answer does not get included in the bundle)
     */
    resolve(),
    /**
     * 🛑 rollup-plugin-commonjs should go 👉 BEFORE 👈 other plugins that transform your modules — this is to prevent other plugins from making changes that break the CommonJS detection.
     * At the moment, the majority of packages on NPM are exposed as CommonJS modules.
     * Until that changes, we need to convert CommonJS to ES2015 before Rollup can process them.
     */
    common(),
    // https://github.com/rollup/rollup-plugin-typescriptyarn add rollup-plugin-postcss --dev
    ts(),
    /**
     * https://github.com/rollup/rollup-plugin-json
     * import only used props from a JSON file, discard the rest
     */
    json(),
    // Display notifications on build fail
    notify(),
    sizes(),
    visualizer()
  ],
  output: [
    /**
     * https://rollupjs.org/guide/en/#quick-start
     * Browsers: iife
     * Node.js: cjs
     * Both browsers and Node.js: umd
     *
     * https://rollupjs.org/guide/en/#compatibility
     */
    {
      // Using dir allows for code splitting
      // https://rollupjs.org/guide/en/#code-splitting
      dir: dirname(pkg.main), // path.dirname("/blah/indeed/whatever.js") -> "/blah/indeed"
      format: "cjs"
    }
  ]
};
