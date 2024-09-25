import path from 'path';
import os from 'os';

export const config = {
  defaultConcurrency: 4,
  maxConcurrency: 8,
  preserveLayers: true,
  tempDir: path.join(os.tmpdir(), 'layerleap'),
  gimpExecutable: process.platform === 'win32' ? 'gimp-console-2.10.exe' : 'gimp',
  logFile: path.join(os.homedir(), '.layerleap', 'conversion.log'),
};