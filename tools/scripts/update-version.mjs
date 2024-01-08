// update-version.mjs

import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const versionFile = 'version.json';
const distFolder = 'dist';
const filesToUpdate = ['manifest.json', 'package.json'];

async function getVersion() {
  const data = await readFile(versionFile, 'utf8');
  const { version } = JSON.parse(data);
  return version;
}

async function updateVersionInFile(file, version) {
  const data = await readFile(file, 'utf8');
  const json = JSON.parse(data);
  json.version = version;
  await writeFile(file, JSON.stringify(json, null, 2), 'utf8');
}

async function updateFilesInDirectory(directory, version) {
  const files = await readdir(directory, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(directory, file.name);
    if (file.isDirectory()) {
      await updateFilesInDirectory(fullPath, version);
    } else if (filesToUpdate.includes(file.name)) {
      await updateVersionInFile(fullPath, version);
    }
  }
}

async function main() {
  try {
    const version = await getVersion();
    await updateFilesInDirectory(distFolder, version);
    console.log(`Updated files in ${distFolder} to version ${version}`);
  } catch (error) {
    console.error('Error updating version:', error);
    process.exit(1);
  }
}

main();
