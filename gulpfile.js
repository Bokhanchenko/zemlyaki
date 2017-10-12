'use strict'

// var gulp = require('gulp');
// var	partials = require('gulp-partials');
// var browserSync = require('browser-sync');
//
// gulp.task('partials', function () {
//     return gulp.src('partials/*.scss')
//         .pipe(partials({outputStyle: 'expanded'}).on('error', partials.logError))
//         .pipe(partials())
//         .pipe(gulp.dest('css'))
//         .pipe(browserSync.reload({stream:true}));
// });
//
// gulp.task('browser-sync', function() {
// 	browserSync({
// 		server: {baseDir: ''},
// 		notify: false
// 	});
// });
//
// gulp.task('watch', ['browser-sync', 'partials'],function () {
//     gulp.watch('partials/**/*.scss', ['partials']);
//     gulp.watch('*.html', browserSync.reload);
// });

// const gulp = require('gulp'),
//     sass = require('gulp-sass'),
//     browserSync = require('browser-sync'),
//     autoprefixer = require('gulp-autoprefixer'),
//     rimraf = require('rimraf'),
//     rigger = require('gulp-rigger'),
//     concat = require('gulp-concat'),
//     cssnano = require('gulp-cssnano'),
//     // del = require('del'),
//     uglify = require('gulp-uglify'),
//     babel = require('gulp-babel'),
//     imagemin = require('gulp-imagemin'),
//     concatCss = require('gulp-concat-css'),
//     pngquant = require('imagemin-pngquant');
//
// let paths = {
//     build: {
//         html: 'build/',
//         js: 'build/js/',
//         css: 'build/css/',
//         img: 'build/img/',
//         fonts: 'build/fonts/'
//     },
//     src: {
//         html: 'src/*.html',
//         js: 'src/js/**/*.js',
//         style: 'src/style/*.scss',
//         img: 'src/img/**/*.+(jpeg|jpg|JPG|png|tiff|webp|svg)',
//         fonts: 'src/fonts/**/*.*'
//     },
//     watch: {
//         html: 'src/**/*.html',
//         js: 'src/js/**/*.js',
//         style: 'src/style/**/*.scss',
//         img: 'src/img/**/*.*',
//         fonts: 'src/fonts/**/*.*'
//     },
//     clean: './dist'
// };
//
// gulp.task('sass', function () {
//     gulp.src(paths.src.style)
//         .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
//         .pipe(sass())
//         .pipe(autoprefixer({
//             browsers: ['last 2 versions'],
//             cascade: false
//         }))
//         .pipe(concatCss('style.css'))
//         .pipe(gulp.dest(paths.build.css))
//         .pipe(browserSync.reload({stream: true}));
// });
//
// gulp.task('html', function () {
//     gulp.src(paths.src.html)
//         .pipe(rigger())
//         .pipe(gulp.dest(paths.build.html))
//         .pipe(browserSync.reload({stream: true}));
// });
//
// gulp.task('js', function () {
//     gulp.src(paths.src.js)
//         .pipe(rigger())
//         .pipe(babel({presets: ['env']}))
//         .pipe(uglify())
//         .pipe(gulp.dest(paths.build.js))
//         .pipe(browserSync.reload({stream: true}));
// });
//
// gulp.task('fonts', function() {
//     gulp.src(paths.src.fonts)
//         .pipe(gulp.dest(paths.build.fonts))
//         .pipe(browserSync.reload({stream: true}));
// });
//
// gulp.task('img', function () {
//     gulp.src(paths.src.img)
//         .pipe(imagemin())
//         .pipe(gulp.dest(paths.build.img))
//         .pipe(browserSync.reload({stream: true}));
// });
//
//
// gulp.task('server', function () {
//     browserSync({
//         server: {baseDir: paths.build.html},
//         notify: false
//     });
// });
//
// gulp.task('watch', ['sass', 'html', 'js', 'img'], function () {
//     gulp.watch(paths.watch.style, ['sass']);
//     gulp.watch(paths.watch.html, ['html']);
//     gulp.watch(paths.watch.js, ['js']);
//     gulp.watch(paths.watch.img, ['img']);
//     gulp.watch(paths.watch.fonts, ['fonts']);
// });
//
// gulp.task('default', ['server', 'html', 'sass', 'js', 'fonts', 'img', 'watch']);

const gulp = require( 'gulp')
    ,useref = require( 'gulp-useref')
    ,htmlmin = require( 'gulp-htmlmin')
    ,plumber = require( 'gulp-plumber')
    ,gm = require('gulp-gm')
    ,watch = require( 'gulp-watch')
    ,prefixer = require( 'gulp-autoprefixer')
    ,uglify = require( 'gulp-uglify')
    ,sass = require( 'gulp-sass')
    ,sourcemaps = require( 'gulp-sourcemaps')
    ,imageResize = require('gulp-image-resize')
    ,rigger = require( 'gulp-rigger')
    ,cssmin = require( 'gulp-clean-css')
    ,rimraf = require( 'rimraf')
    // ,pug = require('gulp-pug')
    ,browserSync = require( 'browser-sync')
    ,babel= require('gulp-babel')
    ,reload = browserSync.reload
    ,changeCase = require('change-case')
    ,rename = require("gulp-rename");


let path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: {
        html: 'src/*.html',
        js: 'src/js/**/*.js',
        style: 'src/style/*.scss',
        img: 'src/img/**/**',
        fonts: 'src/fonts/**/*.*'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.scss',
        img: 'src/img/**',
        fonts: 'src/fonts/**/*.*'
    },
    clean: 'build'
};

let config = {
    server: {
        baseDir: "./dist"
    },
    tunnel: false,
    host: 'localhost',
    port: 9999,
    logPrefix: "front_log"
};

let logErr = function( err){
    console.warn( err);
    this.emit( 'end');
}

gulp.task( 'html:build', function () {
    gulp.src( path.src.html)
        // .pipe(pug())
        .pipe( plumber())
        .pipe( rigger())
        .pipe( useref())
        .pipe( htmlmin({collapseWhitespace: true}))
        .pipe( gulp.dest( path.build.html))
        .pipe( reload( { stream: true}));
});

gulp.task( 'js:build', function () {
    gulp.src( path.src.js)
        .pipe( babel({
            presets: ['es2015']
        }))
        .pipe( plumber())
        .pipe( rigger())
        .pipe( sourcemaps.init())
        .pipe( uglify())
        .pipe( sourcemaps.write())
        .pipe( gulp.dest( path.build.js))
        .pipe( reload( { stream: true}));
});

gulp.task( 'style:build', function () {
    gulp.src( path.src.style)
        .pipe( plumber())
        .pipe( sourcemaps.init())
        .pipe( sass({
            includePaths: require('node-normalize-scss').includePaths
        }))
        .pipe( prefixer({
            browsers: ['last 100 versions'],
            cascade: false
        }))
        .pipe( cssmin())
        .pipe( sourcemaps.write())
        .pipe( gulp.dest(path.build.css))
        .pipe( reload( { stream: true}));
});

gulp.task( 'image:build', function () {
    console.log(path.src.img)
    gulp.src(path.src.img)
        .pipe( plumber())
        .pipe( rename( (path) => {
            path.dirname = changeCase.lowerCase(path.dirname);
            path.basename = changeCase.lowerCase(path.basename);
            path.extname = changeCase.lowerCase(path.extname);
        }))
        .pipe( gulp.dest( path.build.img))
        .pipe( reload( { stream: true}));
});

gulp.task('fonts:build', function() {
    gulp.src( path.src.fonts)
        .pipe( plumber())
        .pipe( gulp.dest(path.build.fonts))
});

gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build'
]);


gulp.task('watch', function(){
    watch([path.watch.html], function (event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});

gulp.task('server', function () {
    browserSync({
        server: {baseDir: path.build.html},
        notify: false
    });
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'server', 'watch']);


