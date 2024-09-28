#!/usr/bin/env node

import { Command } from 'commander';
import { convertCommand, rewindCommand } from './commands';

const program = new Command();

program
  .name('layerleap')
  .description('CLI to convert between PSD and XCF file formats')
  .version('1.0.0');

program.addCommand(convertCommand);
program.addCommand(rewindCommand);

program.parse(process.argv);