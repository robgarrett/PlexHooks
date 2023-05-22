import { merge } from "webpack-merge";
import Dotenv from "dotenv-webpack";
import multer from "multer";
import common from "./webpack.common.config.js";
import dotenv from "dotenv";
import webpack from "webpack";
import home from "./src/home.js";
import webhook from "./src/webhook.js";

// Load the environment from our .env file.
dotenv.config();

// In memory parsing of multi-form data.
const upload = multer();

const webpackConfig = {
    mode: "development",
    devtool: "source-map",
    devServer: {
        setupMiddlewares: (middlewares, devServer) => {
            if (!devServer) {
                throw new Error("webpack-dev-server is not defined");
            }
            // Handlers
            devServer.app.get("/", home);
            devServer.app.post("/", upload.single("thumb"), webhook);
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
