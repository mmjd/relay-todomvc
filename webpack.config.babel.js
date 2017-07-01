import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import webpack from 'webpack';

const production = process.env.NODE_ENV === 'production';

const extractTextPluginLoader = ExtractTextPlugin.extract({
                fallback:'style-loader',
                use: ['css-loader?sourceMap&modules&localIdentName=[name]__[local]___[hash:base64:5]','postcss-loader']
              });
  
export default {
  entry: [
    'babel-polyfill',
    './src/client',
  ],

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },

  // output: {
  //   path: '/',
  //   filename: 'bundle.js',
  // },
  // 
  
  

  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, use: 'babel-loader' },
      { test: /learn\.json$/, use: 'file-loader?name=[name].[ext]' },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
                fallback:'style-loader',
                use: ['css-loader?sourceMap&modules&localIdentName=[name]__[local]___[hash:base64:5]','postcss-loader']
              })
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
                fallback:'style-loader',
                use: ['css-loader?sourceMap&modules&localIdentName=[name]__[local]___[hash:base64:5]','postcss-loader', 'saas-loader']
              })
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
                fallback:'style-loader',
                use: ['css-loader?sourceMap&modules&localIdentName=[name]__[local]___[hash:base64:5]','postcss-loader', 'less-loader']
              })
      },
      {
        test: /\.(gif|jpg|png|woff|woff2|eot|ttf|svg)$/,
        use: 'url-loader?limit=100000',
   
      },
      {
        test: /\.json$/,
        use: "json-loader"
      }
    ]
  },



        // {
        //   test: /\.css$/,
        //   //loaders: ['style-loader','css-loader?importLoders=1', 'postcss-loader']
        //   //loader: ExtractTextPlugin.extract({fallbackLoader:'style', loader:'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'})//
        //   loader: ExtractTextPlugin.extract({fallbackLoader:'style-loader', loader:'css-loader?sourceMap&modules&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader'})
        //   //loader: ExtractTextPlugin.extract({fallbackLoader:'style', loader:'css?modules&localIdentName=[hash:base64:5]!postcss'})
        // },
        // {
        //   test: /\.scss$/,
        //   //loaders: ['style-loader','css-loader?importLoders=1', 'postcss-loader']
        //   //loader: ExtractTextPlugin.extract({fallbackLoader:'style', loader:'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'})//
        //   loader: ExtractTextPlugin.extract({fallbackLoader:'style-loader', loader:'css-loader?sourceMap&modules&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader!sass-loader'})
        //   //loader: ExtractTextPlugin.extract({fallbackLoader:'style', loader:'css?modules&localIdentName=[hash:base64:5]!postcss'})
        // },
        // {
        //   test: /\.less$/,
        //   //loaders: ['style-loader','css-loader?importLoders=1', 'postcss-loader']
        //   //loader: ExtractTextPlugin.extract({fallbackLoader:'style', loader:'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'})//
        //   loader: ExtractTextPlugin.extract({fallbackLoader:'style-loader', loader:'css-loader?sourceMap&modules&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader!less-loader'})
        //   //loader: ExtractTextPlugin.extract({fallbackLoader:'style', loader:'css?modules&localIdentName=[hash:base64:5]!postcss'})
        // },
        // {
        //   loader: 'url-loader?limit=100000',
        //   test: /\.(gif|jpg|png|woff|woff2|eot|ttf|svg)$/
     
        // },
        // {
        //   test: /\.json$/,
        //   loader: "json-loader"
        // }


  plugins: [
    new ExtractTextPlugin('styles.css'),
  ],
  plugins: [
      // https://webpack.js.org/plugins/commons-chunk-plugin/
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: Infinity,
        filename: 'vendor.bundle.js'
      }),
      new ExtractTextPlugin({ filename: 'styles.css', allChunks: true }),
      //https://webpack.js.org/plugins/no-emit-on-errors-plugin/
      new webpack.NoEmitOnErrorsPlugin(),
      //you have to define any node envrionment variable here
      new webpack.DefinePlugin({
      'process.env': {
         IS_BROWSER: true,
         NODE_ENV: (production ? JSON.stringify("production") : JSON.stringify("development")),
      },
    }),
  ],


  devtool: production ? 'source-map' : 'module-source-map',

  devServer: {
    contentBase: "./build",
    publicPath: "/build",
    inline: true,
    historyApiFallback: true,
    port: 8888,
  },
};
