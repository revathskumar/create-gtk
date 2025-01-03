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
  packageJSON.bin = `bin/${packageJSON.name}`;

  packageJSON.scripts = {
    check: "tsc --noEmit",
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

const updateFileContent = (projectDir, fileName, projectName) => {
  const srcIndex = fs.readFileSync(`${projectDir}/${fileName}`, "utf-8");
  const content = srcIndex
    .replaceAll("<user>", process.env.USER)
    .replaceAll("<project.name>", projectName)
    .replaceAll("<year>", new Date().getFullYear());

  fs.writeFileSync(`${projectDir}/${fileName}`, content);
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
  mkdirpSync(projectDir + "/data/icons", { recursive: true });
  mkdirpSync(projectDir + "/dist");

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
    "dist/src.gresource.xml": `dist/com.${process.env.USER}.${name}.src.gresource.xml`,
    "dist/app_id.js": `dist/com.${process.env.USER}.${name}.js`,
    "data/metainfo.xml": `data/com.${process.env.USER}.${name}.metainfo.xml`,
  };
  [
    "README.md",
    "LICENSE",
    ".editorconfig",
    "gitignore",
    ".nvmrc",
    "esbuild.js",
    "tsconfig.json",
    "meson.build",

    "src/MainWindow.ts",
    "src/MenuButton.ts",
    "src/index.ts",

    "bin/bin",

    "dist/meson.build",
    "dist/src.gresource.xml",
    "dist/app_id.js",
    "dist/main.js",

    "data/meson.build",
    "data/metainfo.xml",
  ].forEach((fileName) => {
    const destFileName = altNames[fileName] || fileName;

    fs.copyFile(templateDir + fileName, projectDir + destFileName, (err) => {
      if (err) throw err;
    });
  });
  process.chdir(projectDir);
  execSync("npm init -y");
  updatePackageJSON(projectDir);

  [
    "meson.build",
    "LICENSE",
    "README.md",

    "src/MainWindow.ts",
    "src/index.ts",

    `dist/com.${process.env.USER}.${name}.src.gresource.xml`,
    `dist/com.${process.env.USER}.${name}.js`,

    `data/com.${process.env.USER}.${name}.metainfo.xml`,
  ].forEach((fileName) => {
    updateFileContent(projectDir, fileName, name);
  });
  execSync("git init");
  console.log(`${name} project created`);
  console.log(`Run chmod +x ./bin/${name}`);
}
