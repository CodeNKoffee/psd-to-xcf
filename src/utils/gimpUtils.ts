import fs from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';
import { config } from '../config';
import { ConversionResult, GimpConversionOptions } from '../types';
import { appendFile } from 'fs/promises'; // For logging metadata

// Function to check XCF file metadata
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

// Rewind PSD generation from XCF file
export async function rewindFile(inputFile: string, outputPath: string): Promise<ConversionResult> {
  const outputFile = path.join(outputPath, `${path.basename(inputFile, '.xcf')}.psd`);

  // Check if the XCF file contains the original PSD metadata
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

// Function to log conversion metadata
async function logConversionMetadata(inputFile: string, outputFile: string) {
  const metadata = `Original PSD: ${inputFile}\nConverted on: ${new Date().toISOString()}`;
  await appendFile('conversion-log.json', JSON.stringify({ inputFile, outputFile, date: new Date().toISOString() }) + '\n', 'utf8');
  return metadata;
}

// Convert PSD to XCF
export async function convertFile(inputFile: string, outputPath: string, options: GimpConversionOptions): Promise<ConversionResult> {
  const outputFile = path.join(outputPath, `${path.basename(inputFile, '.psd')}.xcf`);

  // Log conversion metadata
  const metadata = await logConversionMetadata(inputFile, outputFile);

  return new Promise((resolve) => {
    const gimpProcess = spawn(config.gimpExecutable, [
      '-i',
      '-b',
      `(batch-convert-psd-to-xcf "${inputFile}" "${outputFile}" ${options.preserveLayers})`,
      '-b',
      `(gimp-image-comment-add "${outputFile}" "${metadata}")`, // Adding metadata to the XCF file
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