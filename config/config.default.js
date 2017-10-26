'use strict';

exports.typescript = {
  compilerOptions: {
    target: 'es6',
    jsx: 'preserve',
    moduleResolution: 'node',
    declaration: false,
    sourcemap: true
  }
}

exports.build = {
  webpack: (webpackConfig, webpack, config) => {
    webpackConfig.module.rules.push(
      {
        test: /\.tsx$/,
        loader: 'babel-loader!' + require.resolve('ts-loader'),
        options: {
          compilerOptions: config.typescript.compilerOptions
        }
      }
    )

    webpackConfig.plugins.push(
      new webpack.WatchIgnorePlugin([
        /\.js$/,
        /\.d\.ts$/
      ])
    )

    return webpackConfig;
  }
}
