import { Command } from 'commander';
import { rewindFile } from '../utils/gimpUtils';  // Modified the import from 'rewind' to 'rewindFile'
import { validateInputPath, validateOutputPath } from '../utils/fileUtils';
import { RewindOptions } from '../types';

export const rewindCommand = new Command('rewind')
  .description('Regenerate PSD files from XCF format')
  .requiredOption('-i, --input <path>', 'Input directory or file (XCF)')
  .requiredOption('-o, --output <path>', 'Output directory for regenerated PSD files')
  .action(async (options: RewindOptions) => {
    try {
      const inputPath = await validateInputPath(options.input);
      const outputPath = await validateOutputPath(options.output);

      await rewindFile(inputPath, outputPath);  // Changed 'rewind' to 'rewindFile'
      console.log('PSD regeneration completed successfully!');
    } catch (error) {
      console.error('Error during PSD regeneration:', error);
      process.exit(1);
    }
  });