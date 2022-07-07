module.exports = {
    mode: 'production',
    entry: ['./dist/main.bundle.js',"./src/assets/css/main.css"],
    output: {
        filename: 'main.bundle.js',
        publicPath: "https://nicobrown.github.io/Milestone2/",
    },
    module: {
        rules: [{ test: /\.css$/,use: [
            'style-loader',
            'css-loader']
        }],
      },
};