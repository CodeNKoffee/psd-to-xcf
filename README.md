# LayerLeap: Batch PSD to XCF Converter

"Effortlessly leap between Photoshop and GIMP, preserving your layer structures."

LayerLeap is a powerful TypeScript-based command-line tool that simplifies the process of batch converting Photoshop (PSD) files to GIMP's native XCF format. Unlike other conversion tools, LayerLeap ensures that the layer structure of your PSD files is preserved, preventing flattening during the conversion process.

## Features

- **Batch Processing**: Convert hundreds of PSD files to XCF format with a single command.
- **Layer Preservation**: Maintain the integrity of your layer structure during the conversion process.
- **Cross-Platform Compatibility**: Works seamlessly on Windows, macOS, and Linux.
- **Detailed Logging**: Receive comprehensive logs and error reports for each conversion, including failed files.
- **Progress Reporting**: Monitor the conversion progress with a visual indicator.
- **Resumable Conversions**: Resume interrupted batch conversions without starting from the beginning.

## Installation

You can install LayerLeap using npm:

```bash
npm install -g layerleap
```

## Usage

To convert a batch of PSD files to XCF format, run the following command:

```bash
layerleap --input="/path/to/psd/files" --output="/path/to/output/directory"
```

You can also customize the conversion process by using additional options:

```bash
layerleap --input="/path/to/psd/files" --output="/path/to/output/directory" --concurrency=4 --preserveLayers=true
```

For more information on the available options, run:

```bash
layerleap --help
```

## Contributing

We welcome contributions to LayerLeap! If you encounter any issues or have suggestions for improvements, please feel free to open an issue or submit a pull request on the [GitHub repository](https://github.com/CodeNKoffee/layerleap).

## License

LayerLeap is licensed under the [MIT License](LICENSE).
