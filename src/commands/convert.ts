import { Command } from 'commander';
import path from 'path';
import { processDirectory } from '../utils/fileUtils';
import { convertFile } from '../utils/gimpUtils';
import { ConversionResult } from '../types';

export const convertCommand = new Command('convert')
  .description('Convert PSD files to XCF format')
  .argument('[directory]', 'Directory containing PSD files (default: current directory)', '.')
  .option('-o, --output <path>', 'Output directory for converted XCF files', './layerleap_output')
  .action(async (directory: string, options: { output: string }) => {
    try {
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