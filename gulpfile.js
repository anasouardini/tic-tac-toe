const {src, dest, watch, series, parallel, task} = require("gulp");
const concat = require("gulp-concat");
const postcss = require("gulp-postcss");
const replace = require("gulp-replace");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const browsersync = require('browser-sync').create();

const paths = {
    distPath: "dist/",
    srcPath: "src/",
    stylePath: "styles/",
    styleFiles: "styles/**/*.scss",
    jsPath: "scripts/",
    jsFiles: "scripts/**/*.js",
    htmlFiles: "**/*.html"
}

const timeMsNow = new Date().getTime();

//////* TASKS

function serverInit() {
    browsersync.init({
       server: {
          baseDir: paths.distPath
       },
    })
}


function sassTask(){
    return  src(paths.srcPath+paths.styleFiles)
            .pipe(sourcemaps.init())
            .pipe(sass())
            .pipe(postcss([autoprefixer()]))
            // .pipe(postcss([autoprefixer(), cssnano()]))
            .pipe(sourcemaps.write("."))
            .pipe(dest(paths.distPath+paths.stylePath))
            .pipe(browsersync.reload({stream: true}));
}

function jsTask(){
    return  src(paths.srcPath+paths.jsFiles)
            // .pipe(concat("all.js"))
            //.pipe(uglify())
            .pipe(dest(paths.distPath+paths.jsPath))
            .pipe(browsersync.reload({stream: true}));
}

function htmlTask(){
    return  src([paths.distPath+"*.html", paths.distPath+paths.htmlFiles])
            .pipe(browsersync.reload({stream: true}));
}

//////* WATCHERS

function watchStyles(){
    watch([paths.srcPath+paths.styleFiles], parallel(sassTask));
}
function watchscritps(){
    watch([paths.srcPath+paths.jsFiles], parallel(jsTask));
}
function watchDom(){
    watch([paths.distPath+"*.html", paths.htmlFiles], parallel(htmlTask));
}
//////* DEFAULT

exports.default = series(
    parallel(serverInit, sassTask, jsTask, watchStyles, watchscritps, watchDom),
);