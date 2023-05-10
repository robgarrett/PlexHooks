import BrowserSyncPlugin from "browser-sync-webpack-plugin";
import merge from "webpack-merge";
import Dotenv from "dotenv-webpack";
import common from "./webpack.common.config.babel";
import dotenv from "dotenv";
import webpack from "webpack";
import home from "./src/home";

// Load the environment from our .env file.
dotenv.config();

const webpackConfig = {
    mode: "development",
    devtool: "source-map",
    devServer: {
        setupMiddlewares: (middlewares, devServer) => {
            if (!devServer) {
                throw new Error("webpack-dev-server is not defined");
            }
            devServer.app.get("/", home);
            return middlewares;
        },
        open: false,
        client: {
            logging: "verbose"
        },
        historyApiFallback: true,
        watchFiles: [
            "src/**/*.js",
            "*.js"
        ]
    },
    plugins: [
        new Dotenv(),
        new BrowserSyncPlugin({
            host: "localhost",
            port: 3000,
            open: false,
            proxy: "http://localhost:8080/"
        }),
        new webpack.BannerPlugin(
            "require('source-map-support').install();",
            {
                raw: true,
                entryOnly: false
            }
        )
    ]
};

export default merge(common, webpackConfig);
