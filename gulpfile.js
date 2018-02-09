var _ = require('underscore');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var cssMin = require('gulp-minify-css');
var fileSystem = require('fs');
var forEach = require('gulp-foreach');
var gulp = require('gulp');
var gutil = require('gulp-util');
var handlebars = require('Handlebars');
var jsValidate = require('gulp-jsvalidate');
var markdown = require('gulp-markdown');
var path = require('path');
var Readable = require('stream').Readable;
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var tap = require('gulp-tap');
var uglify = require('gulp-uglify');
var webServer = require('gulp-webserver');

var outputDir = 'docs_new/'

gulp.task('build', ['cname', 'homepage']);

gulp.task('clean:cname', cleanCName);

gulp.task('clean:html', cleanHtml);

gulp.task('cname', ['clean:cname'], cName);

gulp.task('homepage', ['clean:html'], homepage);

gulp.task('default', ['build']);

gulp.task('serve', ['default'], serve);

gulp.task('watch', ['default'], watch);

function cleanCName() {
    return gulp.src(outputDir + 'CNAME')
        .pipe(clean());
}

function cleanHtml() {
    return gulp.src(outputDir + '*.html', {
            read: false
        })
        .pipe(clean());
}

function cName() {
    return stringSrc("CNAME", "baerbradford.com")
        .pipe(gulp.dest(outputDir));
}

function homepage() {
    return gulp.src(['content/index.html'])
        .pipe(gulp.dest(outputDir));
}

function serve() {
    var webConfig = {
        livereload: true,
        middleware: function (req, res, next) {
            if (req.url.indexOf('.') >= 0) {
                // Already has extension. Don't modify.
                next();
                return;
            }

            // If `/` is requested. append index to it
            if (req.url === '/') {
                req.url = '/index';
            }
            // Append .html.
            const url = req.url + '.html';
            req.url = url;
            next();
        },
        open: 'http://localhost',
        port: 80
    };
    return gulp.src(outputDir)
        .pipe(webServer(webConfig));
}

function stringSrc(filename, string) {
    var src = require('stream').Readable({
        objectMode: true
    })
    src._read = function () {
        this.push(new gutil.File({
            cwd: "",
            base: "",
            path: filename,
            contents: new Buffer(string)
        }))
        this.push(null)
    }
    return src
}

function watch() {
    return gulp.watch(['content/**'], ['default']);
}