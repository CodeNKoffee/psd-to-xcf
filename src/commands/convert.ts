import { Command } from 'commander';
import path from 'path';
import { processDirectory } from '../utils/fileUtils';
import { convertFile } from '../utils/gimpUtils';
import { ConversionResult } from '../types';
import { exec } from 'child_process';
import { config } from '../config';

function checkGimpInstallation(gimpExecutable: string): Promise<void> {
  return new Promise((resolve, reject) => {
    exec(`which ${gimpExecutable}`, ({error, stdout, stderr}: any) => {
      if (error) {
        reject(new Error(`GIMP is not installed. Please install GIMP to use this tool.`));
      } else {
        resolve();
      }
    });
  });
}

export const convertCommand = new Command('convert')
  .description('Convert PSD files to XCF format')
  .argument('[directory]', 'Directory containing PSD files (default: current directory)', '.')
  .option('-o, --output <path>', 'Output directory for converted XCF files', './layerleap_output')
  .action(async (directory: string, options: { output: string }) => {
    try {
      await checkGimpInstallation(config.gimpExecutable).catch((error) => {
        console.error(error.message);
        process.exit(1);
      });

      const inputPath = path.resolve(directory);
      const outputPath = path.resolve(options.output);

      console.log(`Converting PSD files in ${inputPath}`);
      console.log(`Output directory: ${outputPath}`);

      const results: ConversionResult[] = await processDirectory(inputPath, outputPath, async (file, outPath) => {
        if (path.extname(file).toLowerCase() === '.psd') {
          return await convertFile(file, outPath);
        }
        return { success: false, inputFile: file, outputFile: '', error: 'Not a PSD file' };
      });

      console.log('Conversion process completed.');
      console.log('Results:');
      results.forEach((result) => {
        if (result.success) {
          console.log(`✅ ${result.inputFile} -> ${result.outputFile}`);
        } else {
          console.log(`❌ ${result.inputFile}: ${result.error}`);
        }
      });
    } catch (error) {
      console.error('Error during conversion:', error);
      process.exit(1);
    }
  });