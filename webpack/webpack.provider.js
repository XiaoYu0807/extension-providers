const createConfig = require('./webpack.shared.js');

module.exports = createConfig({
    provider: './src/index.ts',
});
