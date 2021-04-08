const fs = require("fs");
const path = require("path");
const { argv } = require("process");

const projectRoot = argv[2] || path.join(__dirname, "..");

// Add deps to pkg.json
const packageJSON = JSON.parse(
  fs.readFileSync(path.join(projectRoot, "package.json"), "utf8"),
);
packageJSON.devDependencies = Object.assign(packageJSON.devDependencies || {}, {
  "@rollup/plugin-commonjs": "^16.0.0",
  "@rollup/plugin-node-resolve": "^10.0.0",
  "@rollup/plugin-typescript": "^6.0.0",
  "@tsconfig/svelte": "^1.0.0",
  "rollup-plugin-css-only": "^3.1.0",
  "rollup-plugin-livereload": "^2.0.0",
  "rollup-plugin-svelte": "^7.0.0",
  "rollup-plugin-terser": "^7.0.0",
  "rollup": "^2.3.4",
  "svelte-check": "^1.0.0",
  "svelte-preprocess": "^4.0.0",
  "svelte": "^3.0.0",
  tslib: "^2.0.0",
  typescript: "^3.9.3",
});

// Add script for checking
packageJSON.scripts = Object.assign(packageJSON.scripts || {}, {
  "build": "rollup -c",
  "dev": "rollup -c -w",
  validate: "svelte-check",
});

// Write the package JSON
fs.writeFileSync(
  path.join(projectRoot, "package.json"),
  JSON.stringify(packageJSON, null, "  "),
);

// Edit rollup config
const rollupConfigPath = path.join(projectRoot, "rollup.config.js");
let rollupConfig = fs.readFileSync(rollupConfigPath, "utf8");

// Edit imports
rollupConfig = rollupConfig.replace(
  `"rollup-plugin-terser";`,
  `"rollup-plugin-terser";
import sveltePreprocess from "svelte-preprocess";
import typescript from "@rollup/plugin-typescript";`,
);

// Replace name of entry point
rollupConfig = rollupConfig.replace(`"src/index.js"`, `"src/index.ts"`);

// Add preprocessor
rollupConfig = rollupConfig.replace(
  "compilerOptions:",
  "preprocess: sveltePreprocess(),\n\t\t\tcompilerOptions:",
);

// Add TypeScript
rollupConfig = rollupConfig.replace(
  "commonjs(),",
  "commonjs(),\n\t\ttypescript({\n\t\t\tsourceMap: !production,\n\t\t\tinlineSources: !production\n\t\t}),",
);
fs.writeFileSync(rollupConfigPath, rollupConfig);

// Add TSConfig
const tsconfig = `{
  "extends": "@tsconfig/svelte/tsconfig.json"
}`;
const tsconfigPath = path.join(projectRoot, "tsconfig.json");
fs.writeFileSync(tsconfigPath, tsconfig);

// Delete this script, but not during testing
if (!argv[2]) {
  // Remove the script
  fs.unlinkSync(path.join(__filename));

  // Check for Mac's DS_store file, and if it's the only one left remove it
  const remainingFiles = fs.readdirSync(path.join(__dirname));
  if (remainingFiles.length === 1 && remainingFiles[0] === ".DS_store") {
    fs.unlinkSync(path.join(__dirname, ".DS_store"));
  }

  // Check if the scripts folder is empty
  if (fs.readdirSync(path.join(__dirname)).length === 0) {
    // Remove the scripts folder
    fs.rmdirSync(path.join(__dirname));
  }
}

// Adds the extension recommendation
fs.mkdirSync(path.join(projectRoot, ".vscode"));
fs.writeFileSync(
  path.join(projectRoot, ".vscode", "extensions.json"),
  `{
  "recommendations": ["svelte.svelte-vscode"]
}
`,
);

const indexTs = `import App from "./App.svelte";

const app = new App({
  target: document.body,
    props: {
      name: "world"
    }
});

export default app;
`;
const indexTsPath = path.join(projectRoot, "src/index.ts");
fs.writeFileSync(indexTsPath, indexTs);
