import gulp from "gulp";
import { env } from "process";
import webpack from "webpack";
import webpackStream from "webpack-stream";
import WebPackDevServer from "webpack-dev-server";
import clean from "gulp-clean";
import eslint from "gulp-eslint";
import devConfig from "./webpack.dev.config.js";
import prodConfig from "./webpack.prod.config.js";

/*
 * We're using web pack, which defines entry points.
 * We just need the main express.js file to provide gulp with a src.
 */
const paths = {
    srcFiles: [
        "src/**/*.js",
        "src/**/*.mjs"
    ],
    entryFile: "src/express.js",
    destFolder: "./dist"
};

gulp.task("clean", () => gulp.src([
    paths.destFolder
], {
    read: false,
    allowEmpty: true
}).pipe(clean()));

gulp.task("lint", () => gulp.src(paths.srcFiles).
    pipe(eslint()).
    pipe(eslint.format()).
    pipe(eslint.failAfterError()));

gulp.task("compile:dev", () => {
    env.NODE_ENV = "development";
    return gulp.src(paths.entryFile).
        pipe(webpackStream(devConfig)).
        pipe(gulp.dest(paths.destFolder));
});

gulp.task("compile:prod", () => {
    env.NODE_ENV = "production";
    return gulp.src(paths.entryFile).
        pipe(webpackStream(prodConfig)).
        pipe(gulp.dest(paths.destFolder));
});

gulp.task("devServer", done => {
    const config = Object.assign(devConfig, {});
    new WebPackDevServer(config.devServer, webpack(config)).start();
    done();
});

gulp.task("build", gulp.series("clean", "lint", "compile:dev"));
gulp.task("package", gulp.series("clean", "lint", "compile:prod"));
gulp.task("serve", gulp.series("build", "devServer"));
gulp.task("default", gulp.series("serve"));
