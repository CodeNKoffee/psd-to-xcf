import { Command } from 'commander';
import path from 'path';
import { processDirectory } from '../utils/fileUtils';
import { rewindFile } from '../utils/gimpUtils';
import { ConversionResult } from '../types';

export const rewindCommand = new Command('rewind')
  .description('Convert XCF files back to PSD format')
  .argument('[directory]', 'Directory containing XCF files (default: current directory)', '.')
  .option('-o, --output <path>', 'Output directory for converted PSD files', './layerleap_output')
  .action(async (directory: string, options: { output: string }) => {
    try {
      const inputPath = path.resolve(directory);
      const outputPath = path.resolve(options.output);

      console.log(`Converting XCF files in ${inputPath}`);
      console.log(`Output directory: ${outputPath}`);

      const results: ConversionResult[] = await processDirectory(inputPath, outputPath, async (file, outPath) => {
        if (path.extname(file).toLowerCase() === '.xcf') {
          return await rewindFile(file, outPath);
        }
        return { success: false, inputFile: file, outputFile: '', error: 'Not an XCF file' };
      });

      console.log('Rewind process completed.');
      console.log('Results:');
      results.forEach((result) => {
        if (result.success) {
          console.log(`✅ ${result.inputFile} -> ${result.outputFile}`);
        } else {
          console.log(`❌ ${result.inputFile}: ${result.error}`);
        }
      });
    } catch (error) {
      console.error('Error during rewind process:', error);
      process.exit(1);
    }
  });