import merge from "webpack-merge";
import Dotenv from "dotenv-webpack";
import common from "./webpack.common.config.babel";
import dotenv from "dotenv";
import webpack from "webpack";
import home from "./src/home";
import webhook from "./src/webhook";
import express from "express";

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
            // Parse application/x-www-form-urlencoded
            devServer.app.use(express.urlencoded({ extended: false }));
            // Parse application/json
            devServer.app.use(express.json());
            // Handlers
            devServer.app.get("/", home);
            devServer.app.post("/", webhook);
            return middlewares;
        },
        hot: false,
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
