import { promises as fs } from 'fs';

/**
 * @param {string} filePath
 */
async function readFile(filePath) {
    try {
        const data = await fs.readFile(filePath);
        const map = process(JSON.parse(data));
        await fs.writeFile('dist/src/data.json', JSON.stringify(map));
    } catch (error) {
        console.error(`Got an error trying to read the file: ${error.message}`);
    }
}

/**
 * @typedef Category
 * @prop {number[]} codes
 * @prop {string} url
 */

/**
 * @param {Category[]} categoriesList
 */
function process(categoriesList) {
    const map = {};
    for (let i = 0; i < categoriesList.length; i++) {
        const model = categoriesList[i];
        map[model.url] = model.codes;
    }
    return map;
}
readFile('zvelo/data.json');
