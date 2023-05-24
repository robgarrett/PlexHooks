/* eslint-disable no-process-env */
import { merge } from "webpack-merge";
import common from "./webpack.common.config.babel";
import webpack from "webpack";

const webpackConfig = {
    mode: "production",
    devtool: false,
    performance: {
        hints: "warning",
        maxEntrypointSize: 1024000,
        maxAssetSize: 1024000,
        assetFilter(assetFilename) {
            return assetFilename.endsWith(".js");
        }
    },
    plugins: [

        /*
         * Dev build uses a .env file, in prod we have to explicitly tell webpack
         * to use specific variables from the current environment so we can grab
         * them from host app settings.
         */
        new webpack.DefinePlugin({
            process: {
                env: {
                    "NODE_ENV": JSON.stringify(process.env.NODE_ENV || "production")
                }
            }
        })
    ]
};

export default merge(common, webpackConfig);
