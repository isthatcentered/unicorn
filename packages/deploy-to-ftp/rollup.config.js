import json from "rollup-plugin-json"
import resolve from "rollup-plugin-node-resolve"
import common from "rollup-plugin-commonjs"
import pkg from "./package.json"
import { dirname } from "path"
import ts from "@wessberg/rollup-plugin-ts"
import notify from "rollup-plugin-notify"
import sizes from "rollup-plugin-sizes"
import visualizer from "rollup-plugin-visualizer"

// https://rollupjs.org/guide/en/#creating-your-first-bundle
// https://devhints.io/rollup
export default {
	input: pkg.source,
	// https://rollupjs.org/guide/en/#peer-dependencies
	external: [
		...Object.keys(pkg.dependencies || {}),
		...Object.keys(pkg.peerDependencies || {}),
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
		visualizer(),
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
			format: "cjs",
		},
		/**
		 * Publishing ES Modules
		 * To make sure your ES modules are immediately usable by tools that work with CommonJS
		 * such as Node.js and webpack, you can use Rollup to compile to UMD or CommonJS format,
		 * and then point to that compiled version with the main property in your package.json file.
		 * If your package.json file also has a module field, ESM-aware tools like Rollup and webpack 2+
		 * will import the ES module version directly.
		 */
		{
			dir: dirname(pkg.module),
			format: "es",
		},
	],
}
