import fs from 'fs/promises';
import path from 'path';

export async function validateInputPath(inputPath: string): Promise<string> {
  try {
    const stats = await fs.stat(inputPath);
    if (stats.isFile() && !inputPath.toLowerCase().endsWith('.psd')) {
      throw new Error('Input file must be a PSD file');
    }
    return inputPath;
  } catch (error) {
    throw new Error(`Invalid input path: ${error}`);
  }
}

export async function validateOutputPath(outputPath: string): Promise<string> {
  try {
    await fs.mkdir(outputPath, { recursive: true });
    return outputPath;
  } catch (error) {
    throw new Error(`Invalid output path: ${error}`);
  }
}

export async function getPsdFiles(inputPath: string): Promise<string[]> {
  const stats = await fs.stat(inputPath);
  if (stats.isFile()) {
    return [inputPath];
  }

  const files = await fs.readdir(inputPath);
  return files
    .filter(file => file.toLowerCase().endsWith('.psd'))
    .map(file => path.join(inputPath, file));
}