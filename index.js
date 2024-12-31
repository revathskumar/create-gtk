import fs from "node:fs";
import process from "node:process";
import { mkdirpSync } from "mkdirp";
import { execSync } from "node:child_process";

import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
const name = args[0];

const updatePackageJSON = (projectDir) => {
  const packageJSON = JSON.parse(fs.readFileSync(`${projectDir}/package.json`));
  packageJSON.type = "module";
  packageJSON.main = "dist/index.js";

  packageJSON.scripts = {
    "check:types": "tsc --noEmit",
    build: "node esbuild.js",
  };

  packageJSON.devDependencies = {
    "@girs/adw-1": "^1.7.0-4.0.0-beta.19",
    "@girs/gjs": "^4.0.0-beta.19",
    "@girs/gtk-4.0": "^4.16.3-4.0.0-beta.19",
    esbuild: "^0.24.2",
    eslint: "^9.17.0",
    prettier: "^3.4.2",
    typescript: "^5.7.2",
  };

  fs.writeFileSync(
    `${projectDir}/package.json`,
    JSON.stringify(packageJSON, "", 2)
  );
};

const updateNameInReadme = (projectDir, projectName) => {
  const readme = fs.readFileSync(`${projectDir}/README.md`, "utf-8");
  const content = readme.replace("<name>", projectName);

  fs.writeFileSync(`${projectDir}/README.md`, content);
};

const updateLicense = (projectDir) => {
  const readme = fs.readFileSync(`${projectDir}/LICENSE`, "utf-8");
  const content = readme
    .replace("<name>", process.env.USER)
    .replace("<year>", new Date().getFullYear());

  fs.writeFileSync(`${projectDir}/LICENSE`, content);
};

const updateSrcIndex = (projectDir, projectName) => {
  const srcIndex = fs.readFileSync(`${projectDir}/src/index.ts`, "utf-8");
  const content = srcIndex
    .replace("<user>", process.env.USER)
    .replaceAll("<name>", projectName);

  fs.writeFileSync(`${projectDir}/src/index.ts`, content);
};
const updateMainWindow = (projectDir, projectName) => {
  const srcIndex = fs.readFileSync(`${projectDir}/src/MainWindow.ts`, "utf-8");
  const content = srcIndex
    .replaceAll("<user>", process.env.USER)
    .replaceAll("<name>", projectName)
    .replaceAll("<year>", new Date().getFullYear());

  fs.writeFileSync(`${projectDir}/src/MainWindow.ts`, content);
};

export default function () {
  if (!name) {
    throw new Error("Name is required");
  }
  // check folder with name exists
  mkdirpSync(name);

  const templateDir = `${__dirname}/template/`;
  const projectDir = `${process.cwd()}/${name}/`;

  mkdirpSync(projectDir + "/.vscode");
  mkdirpSync(projectDir + "/src");
  mkdirpSync(projectDir + "/bin");

  fs.copyFile(
    templateDir + "/.vscode/settings.json",
    projectDir + "/.vscode/settings.json",
    (err) => {
      if (err) throw err;
    }
  );

  const altNames = {
    gitignore: ".gitignore",
    "bin/bin": `bin/${name}`,
  };
  [
    "README.md",
    "LICENSE",
    ".editorconfig",
    "gitignore",
    ".nvmrc",
    "esbuild.js",
    "tsconfig.json",
    "src/MainWindow.ts",
    "src/MenuButton.ts",
    "src/index.ts",
    "bin/bin",
  ].forEach((fileName) => {
    const destFileName = altNames[fileName] || fileName;

    fs.copyFile(templateDir + fileName, projectDir + destFileName, (err) => {
      if (err) throw err;
    });
  });
  process.chdir(projectDir);
  execSync("npm init -y");
  updatePackageJSON(projectDir);
  updateNameInReadme(projectDir, name);
  updateSrcIndex(projectDir, name);
  updateMainWindow(projectDir, name);
  updateLicense(projectDir);
  execSync("git init");
  console.log(`${name} project created`);
}
