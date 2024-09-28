import fs from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';
import { config } from '../config';
import { ConversionResult } from '../types';

export async function convertPsdToXcf(inputFile: string, outputPath: string): Promise<ConversionResult> {
  const outputFile = path.join(outputPath, `${path.basename(inputFile, '.psd')}.xcf`);
  const metadata = `Original PSD: ${inputFile}\nConverted on: ${new Date().toISOString()}`;

  return new Promise((resolve) => {
    const gimpProcess = spawn(config.gimpExecutable, [
      '-i',
      '-b',
      `(let* ((image (car (gimp-file-load RUN-NONINTERACTIVE "${inputFile}" "${inputFile}")))
          (drawable (car (gimp-image-get-active-layer image))))
          (gimp-image-set-metadata image "gimp-comment" "${metadata}")
          (gimp-file-save RUN-NONINTERACTIVE image drawable "${outputFile}" "${outputFile}")
          (gimp-image-delete image))`,
      '-b',
      '(gimp-quit 0)',
    ]);

    gimpProcess.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true, inputFile, outputFile });
      } else {
        resolve({ success: false, inputFile, outputFile, error: `GIMP process exited with code ${code}` });
      }
    });
  });
}

export async function checkPsdValidity(inputFile: string): Promise<boolean> {
  try {
    const stats = await fs.stat(inputFile);
    if (stats.size === 0) {
      return false;
    }

    const buffer = await fs.readFile(inputFile, { flag: 'r' });
    const signature = buffer.toString('ascii', 0, 4);
    return signature === '8BPS';
  } catch (error) {
    console.error(`Error checking PSD validity: ${error}`);
    return false;
  }
}