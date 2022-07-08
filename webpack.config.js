// Try the environment variable, otherwise use root
const ASSET_PATH = process.env.ASSET_PATH || '/';

module.exports = {
    mode: 'production',
    entry: ['./src/assets/js/index.js','./src/assets/css/main.css'],
    output: {
        filename: 'main.bundle.js',
        publicPath: ASSET_PATH,
    },
    module: {
        rules: [{ test: /\.css$/,use: [
            'style-loader',
            'css-loader']
        }],
      },
};