export interface ConversionOptions {
  input: string;
  output: string;
  concurrency: string;
  preserveLayers: string;
}

export interface RewindOptions {
  input: string;
  output: string;
}

export interface GimpConversionOptions {
  input: string;
  output: string;
  concurrency: number;
  preserveLayers: boolean;
}

export interface ConversionResult {
  success: boolean;
  inputFile: string;
  outputFile: string;
  error?: string;
}