import { Command } from 'commander';
import { convertFile } from '../utils/gimpUtils';  // Correct import
import { validateInputPath, validateOutputPath } from '../utils/fileUtils';
import { GimpConversionOptions } from '../types';

export const convertCommand = new Command('convert')
  .description('Convert PSD files to XCF format')
  .requiredOption('-i, --input <path>', 'Input PSD file')
  .requiredOption('-o, --output <path>', 'Output directory for converted XCF files')
  .option('--preserve-layers', 'Preserve layers during conversion', false)
  .action(async (options: GimpConversionOptions) => {
    try {
      const inputPath = await validateInputPath(options.input);
      const outputPath = await validateOutputPath(options.output);

      await convertFile(inputPath, outputPath, options);
      console.log('PSD to XCF conversion completed successfully!');
    } catch (error) {
      console.error('Error during conversion:', error);
      process.exit(1);
    }
  });