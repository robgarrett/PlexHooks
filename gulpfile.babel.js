import gulp from "gulp";
import { env } from "process";
import webpackStream from "webpack-stream";
import clean from "gulp-clean";
import eslint from "gulp-eslint-new";
import nodemon from "gulp-nodemon";
import devConfig from "./webpack.dev.config.babel";
import prodConfig from "./webpack.prod.config.babel";

/*
 * We're using web pack, which defines entry points.
 * We just need the main express.js file to provide gulp with a src.
 */
const paths = {
    srcFiles: [
        "src/**/*.js"
    ],
    entryFile: "src/express.js",
    destFolder: "./dist",
    bundledScript: "./dist/express.bundle.js"
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
    nodemon({
        script: paths.bundledScript,
        ext: "js",
        env: { "NODE_ENV": "development" },
        tasks: ["lint",
            "compile:dev"],
        ignore: ["node_modules/"],
        watch: paths.srcFiles,
        done
    }).on("restart", () => {
        console.log("Nodemon restarted");
    });
});

gulp.task("build", gulp.series("clean", "lint", "compile:dev"));
gulp.task("package", gulp.series("clean", "lint", "compile:prod"));
gulp.task("serve", gulp.series("build", "devServer"));
gulp.task("default", gulp.series("serve"));
