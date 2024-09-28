import { spawn } from 'child_process';
import path from 'path';
import { config } from '../config';
import { ConversionResult } from '../types';

export async function convertFile(inputFile: string, outputPath: string): Promise<ConversionResult> {
  const outputFile = path.join(outputPath, `${path.basename(inputFile, '.psd')}.xcf`);
  const metadata = `Original PSD: ${inputFile}\nConverted on: ${new Date().toISOString()}`;

  return new Promise((resolve) => {
    const gimpProcess = spawn(config.gimpExecutable, [
      '-i',
      '-b',
      `(batch-convert-psd-to-xcf "${inputFile}" "${outputFile}" #t)`,
      '-b',
      `(gimp-image-set-metadata "${outputFile}" "gimp-comment" "${metadata}")`,
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

export async function rewindFile(inputFile: string, outputPath: string): Promise<ConversionResult> {
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

async function checkXcfMetadata(inputFile: string): Promise<boolean> {
  return new Promise((resolve) => {
    const gimpProcess = spawn(config.gimpExecutable, [
      '-i',
      '-b',
      `(let* ((image (car (gimp-file-load RUN-NONINTERACTIVE "${inputFile}" "${inputFile}")))
          (metadata (car (gimp-image-get-metadata image "gimp-comment"))))
          (gimp-message metadata)
          (gimp-image-delete image))`,
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