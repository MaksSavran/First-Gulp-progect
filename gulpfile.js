const gulp = require('gulp');
const {series, parallel} = require('gulp');
const pug = require('gulp-pug');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const rename = require("gulp-rename");
const ttf2woff2 = require('gulp-ttf2woff2');
const browserSync = require('browser-sync').create();
const del = require('del');

const html = () => {
    return gulp.src('src/pug/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('built'))
}

const styles = () => {
    return gulp.src('src/styles/*.css')
    .pipe(autoprefixer())
    .pipe(cssnano({
        discardUnused: false
    }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('built/css'))
}

const fonts = () => {
    return gulp.src('src/styles/fonts/*.ttf')
    .pipe(ttf2woff2())
    .pipe(gulp.dest('built/css/fonts'))
}

const images = () => {
     return gulp.src('src/images/*.*')
     .pipe(gulp.dest('built/images'))
 }

const server = () => {
    browserSync.init({
        server: {
            baseDir: './built'
        },
        notify: false
    });
    browserSync.watch('built', browserSync.reload)
}

const deleteBuilt = (cb) => {
    return del('built/**/*.*').then(() => { cb() })
}
const watch = () => {
    gulp.watch('src/html/*.html', html);
    gulp.watch('src/styles/*.css', styles);
    gulp.watch('src/images/*.*', images);
    gulp.watch('src/styles/fonts/*.ttf', fonts);
}

exports.default = series(
    deleteBuilt,
    parallel(html, styles, images, fonts ),
    parallel(watch, server)
)