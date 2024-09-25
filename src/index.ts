#!/usr/bin/env node
import { program } from 'commander';
import { convertCommand, rewindCommand } from './commands';

program
  .name('layerleap')
  .description('Batch convert PSD files to XCF format and vice versa')
  .version('1.0.0');

program.addCommand(convertCommand);
program.addCommand(rewindCommand);

program.parse(process.argv);