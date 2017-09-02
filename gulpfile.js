// var gulp = require('gulp');
// var	sass = require('gulp-sass');
// var browserSync = require('browser-sync');
//
// gulp.task('sass', function () {
//     return gulp.src('sass/*.scss')
//         .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
//         .pipe(sass())
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
// gulp.task('watch', ['browser-sync', 'sass'],function () {
//     gulp.watch('sass/**/*.scss', ['sass']);
//     gulp.watch('*.html', browserSync.reload);
// });

const gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    rimraf = require('rimraf'),
    rigger = require('gulp-rigger'),
    concat = require('gulp-concat'),
    cssnano = require('gulp-cssnano'),
    del = require('del'),
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel'),
    imagemin = require('gulp-imagemin'),
    concatCss = require('gulp-concat-css'),
    pngquant = require('imagemin-pngquant');

const paths = {
    src: {
        html: 'src/*.html',
        style: 'src/style/main.scss',
        js: 'src/js/**/*.js',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    build: {
        html: 'build/',
        js: 'build/js/',
        style: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: '../build'
};

gulp.task('sass', function () {
    gulp.src(paths.src.style)
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(concatCss('main.css'))
        .pipe(gulp.dest(paths.build.style))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('html', function () {
    gulp.src(paths.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(paths.build.html))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('js', function () {
    gulp.src(paths.src.js)
        .pipe(rigger())
        .pipe(babel({presets: ['env']}))
        .pipe(uglify())
        .pipe(gulp.dest(paths.build.js))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('fonts', function() {
    gulp.src(paths.src.fonts)
        .pipe(gulp.dest(paths.build.fonts))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('img', function () {
    gulp.src(paths.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(paths.build.img))
        .pipe(browserSync.reload({stream: true}));
});


gulp.task('server', function () {
    browserSync({
        server: {baseDir: paths.build.html},
        notify: false
    });
});

gulp.task('watch', ['sass', 'html', 'js', 'img'], function () {
    gulp.watch(paths.watch.style, ['sass']);
    gulp.watch(paths.watch.html, ['html']);
    gulp.watch(paths.watch.js, ['js']);
    gulp.watch(paths.watch.img, ['img']);
    gulp.watch(paths.watch.fonts, ['fonts']);
});

gulp.task('default', ['server', 'html', 'sass', 'js', 'fonts', 'img', 'watch']);


