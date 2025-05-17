import fs from "node:fs";
import path from "node:path";

export const getContentFile = async (type: "hook" | "helper", name: string) => {
  try {
    const basePath = `../../packages/core/src/${type}s/${name}/${name}`;
    const dirPath = path.dirname(basePath);

    const files = await fs.promises.readdir(dirPath);

    const fileName = files.find(
      (file) =>
        file.includes(name) &&
        !file.includes(".test") &&
        !file.includes(".demo")
    );

    if (!fileName) {
      throw new Error(`No matching file found for ${name}`);
    }

    const filePath = path.join(dirPath, fileName);
    const content = await fs.promises.readFile(filePath, "utf-8");

    return content;
  } catch (error) {
    console.error(`Error reading file: ${error}`);
    throw error;
  }
};
