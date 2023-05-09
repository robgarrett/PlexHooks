import gulp from "gulp";
import { env } from "process";
import webpack from "webpack";
import webpackStream from "webpack-stream";
import WebPackDevServer from "webpack-dev-server";
import clean from "gulp-clean";
import os from "os";
import devConfig from "./webpack.dev.config.babel";
import prodConfig from "./webpack.prod.config.babel";

/*
 * We're using web pack, which defines entry points.
 * We just need the main index.js file to provide gulp with a src.
 */
const paths = {
    srcFiles: [
        "src/index.js"
    ],
    destFolder: "./dist"
};

const browser = os.platform() === "win32" ? "msedge" : "google-chrome";

gulp.task("clean", () => gulp.src([
    paths.destFolder
], {
    read: false,
    allowEmpty: true
}).pipe(clean()));

gulp.task("compile:dev", () => {
    env.NODE_ENV = "development";
    return gulp.src(paths.srcFiles).
        pipe(webpackStream(devConfig)).
        pipe(gulp.dest(paths.destFolder));
});

gulp.task("compile:prod", () => {
    env.NODE_ENV = "production";
    return gulp.src(paths.srcFiles).
        pipe(webpackStream(prodConfig)).
        pipe(gulp.dest(paths.destFolder));
});

gulp.task("devServer", done => {
    const config = Object.assign(devConfig, {});
    new WebPackDevServer(config.devServer, webpack(config)).start();
    done();
});

gulp.task("build", gulp.series("clean", "compile:dev"));
gulp.task("package", gulp.series("clean", "compile:prod"));
gulp.task("serve", gulp.series("build", "devServer"));
gulp.task("default", gulp.series("serve"));
