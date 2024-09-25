import fs from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';
import { config } from '../config';
import { ConversionResult } from '../types';

async function checkXcfMetadata(inputFile: string): Promise<boolean> {
  return new Promise((resolve) => {
    const gimpProcess = spawn(config.gimpExecutable, [
      '-i',
      '-b',
      `(gimp-comment-extract "${inputFile}")`, // Extract metadata from XCF file
      '-b',
      '(gimp-quit 0)',
    ]);

    let metadata = '';

    gimpProcess.stdout.on('data', (data) => {
      metadata += data.toString();
    });

    gimpProcess.on('close', (code) => {
      if (code === 0 && metadata.includes('Original PSD')) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

async function rewindFile(inputFile: string, outputPath: string): Promise<ConversionResult> {
  const outputFile = path.join(outputPath, `${path.basename(inputFile, '.xcf')}.psd`);

  const isValid = await checkXcfMetadata(inputFile);
  if (!isValid) {
    return {
      success: false,
      inputFile,
      outputFile,
      error: 'XCF file does not contain valid metadata from the original PSD.',
    };
  }

  return new Promise((resolve) => {
    const gimpProcess = spawn(config.gimpExecutable, [
      '-i',
      '-b',
      `(batch-rewind-xcf-to-psd "${inputFile}" "${outputFile}")`,
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