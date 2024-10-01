const path = require('path');

module.exports = {
  entry: './wbund/dashboard.js',  // Entry point of your app
  output: {
    filename: 'dashboard.js',  // Output file name
    path: path.resolve(__dirname, 'dist'),  // Output directory
  },
  mode: 'development',  // Set mode to development
};
