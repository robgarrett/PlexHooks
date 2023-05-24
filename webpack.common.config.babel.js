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
    experiments: {
        outputModule: false
    },
    output: {
        // Output is the dist folder.
        path: path.resolve(__dirname, "dist"),
        filename: "[name].bundle.js",
        chunkFilename: "[name].bundle.js",
        publicPath: "/dist",
        library: {
            type: "commonjs"
        }
    },
    target: "node12.2",
    externals: nodeModules,
    module: {
        rules: [
            {
                test: /\.js$/i,
                exclude: [
                    /node_modules/
                ],
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            [
                                "@babel/preset-env",
                                {
                                    "modules": "commonjs"
                                }
                            ]
                        ]
                    }
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin({
            verbose: true
        }),
        new ESLintPlugin()
    ]
};

export default webpackConfig;
