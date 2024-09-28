import fs from 'fs/promises';
import path from 'path';
import { ConversionResult } from '../types';

export async function processDirectory(
  inputPath: string,
  outputPath: string,
  processFile: (file: string, outputPath: string) => Promise<ConversionResult>
): Promise<ConversionResult[]> {
  await fs.mkdir(outputPath, { recursive: true });

  const files = await fs.readdir(inputPath);
  const results: ConversionResult[] = [];

  for (const file of files) {
    const filePath = path.join(inputPath, file);
    const stat = await fs.stat(filePath);

    if (stat.isFile()) {
      const result = await processFile(filePath, outputPath);
      results.push(result);
      await logConversion(result);
    }
  }

  return results;
}

async function logConversion(result: ConversionResult): Promise<void> {
  const logEntry = JSON.stringify({
    ...result,
    timestamp: new Date().toISOString(),
  });

  await fs.appendFile('conversion.log', logEntry + '\n', 'utf8');
}