import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const entryFiles = ['./public/js/main.js', './public/js/hideModal.js', './public/js/openModal.js'];

export default {
  entry: entryFiles,
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'GeneratedFiles')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  mode: 'development'
};