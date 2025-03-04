import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import path from "path";
import { Configuration as WebpackConfiguration } from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const WEBPACKDEV_PORT = 3000;

const config = (): Configuration => {
  const isDevelopment = true;

  return {
    mode: "development",
    devtool: "inline-source-map",
    entry: { bundle: "./src/entry" },
    module: {
      rules: [
        {
          test: /\.(ts|tsx|js)$/,
          exclude: /node_modules/,
          use: {
            loader: "swc-loader",
            options: {
              jsc: {
                transform: {
                  react: {
                    development: isDevelopment,
                    refresh: isDevelopment,
                  },
                },
              },
            },
          },
        },
      ],
    },

    devServer: {
      historyApiFallback: true,
      hot: true,
      compress: true,
      port: WEBPACKDEV_PORT,
      host: "0.0.0.0",
      allowedHosts: "all",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers":
          "X-Requested-With, content-type, Authorization",
      },
    },

    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    output: {
      path: path.join(__dirname, "build"),
      filename: "[name].js",
      publicPath: "/",
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: "./src/index.html",
            to: "index.html",
          },
        ],
      }),

      new ForkTsCheckerWebpackPlugin({
        typescript: {
          memoryLimit: 8192,
        },
      }),

      new ReactRefreshWebpackPlugin(),
    ],
  };
};

export default config;
