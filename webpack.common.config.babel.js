import ESLintPlugin from "eslint-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import path from "path";
import fs from "fs";

// Exclude node_modules from server-side bundling.
const nodeModules = {};
fs.readdirSync("node_modules").
    filter(x => [".bin"].indexOf(x) === -1).
    forEach(mod => {
        nodeModules[mod] = "commonjs " + mod;
    });

const webpackConfig = {
    // Context is the root of the project
    context: __dirname,
    stats: {
        errorDetails: true,
        children: true
    },
    entry: {
        express: "./src/express.js"
    },
    output: {
        // Output is the dist folder.
        path: path.resolve(__dirname, "dist"),
        filename: "[name].bundle.js",
        chunkFilename: "[name].bundle.js",
        publicPath: "/"
    },
    target: "node",
    devServer: {
        static: `${__dirname}/dist/`,
        devMiddleware: {
            writeToDisk: true
        }
    },
    externals: nodeModules,
    module: {},
    plugins: [
        new CleanWebpackPlugin({
            verbose: true
        }),
        new ESLintPlugin()
    ]
};

export default webpackConfig;
