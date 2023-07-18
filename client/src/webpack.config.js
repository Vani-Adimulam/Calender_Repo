const path = require('path') // This is common.js

console.log('*** webpack started loading. ***');

/*
   webpack config object takes two parameters.
   1. entry: firstFile which need to be loaded.
   2. output:
      -path: directory name so it can store fully minified version of .js 
             files. need to specifiy fully qualified path.
      -filename: file name of minified file.
*/
  const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },

  resolve: {
    fallback: {
      fs: false,
      path: require.resolve("path-browserify"),
      os: require.resolve("os-browserify/browser")
    }
  }
}

console.log('*** webpack loading completed. ***');

module.exports = config; // this is common.js