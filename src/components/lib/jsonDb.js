import fs from 'fs/promises';
import path from 'path';


//  * Reads a JSON file from a relative path.
//  * @param {string} relativePath - Path relative to project root (e.g., 'src/data/users.json').
//  * @param {object|array} fallback - Default value if file doesn't exist or is invalid.
//  * @returns {Promise<any>} Parsed JSON or fallback value.

export const readJson = async (relativePath, fallback = {}) => {
  try {
    const fullPath = path.join(process.cwd(), relativePath);
    const data = await fs.readFile(fullPath, 'utf-8');
    return JSON.parse(data || JSON.stringify(fallback));
  } catch (err) {
    console.warn(`[readJson] Failed to read ${relativePath}:`, err.message);
    return fallback;
  }
};

// 
//  * Writes data as JSON to the specified relative path.
//  * Automatically creates directories if they don't exist.
//  * @param {string} relativePath - Path relative to project root (e.g., 'src/data/users.json').
//  * @param {any} data - Data to be stringified and written.
//  
export const writeJson = async (relativePath, data) => {
  try {
    const fullPath = path.join(process.cwd(), relativePath);
    const dir = path.dirname(fullPath);

    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(fullPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`[writeJson] Failed to write ${relativePath}:`, err.message);
    throw err;
  }
};
