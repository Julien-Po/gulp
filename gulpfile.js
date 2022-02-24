let gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const imagemin = require("gulp-imagemin");
var browserSync = require("browser-sync").create();
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");

gulp.task("sass", function () {
  return gulp
    .src("./src/assets/sass/**/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("./src/assets/css"));
});

gulp.task("sass:watch", function () {
  gulp.watch("./src/assets/sass/**/*.scss", gulp.series("sass"));
});

gulp.task("postcss:min", function () {
  return gulp
    .src("./src/assets/css/*.css")
    .pipe(postcss([cssnano]))
    .pipe(gulp.dest("./dist/assets/css"));
});

gulp.task("postcss:prefix", function () {
  return gulp
    .src("./dist/assets/css/*.css")
    .pipe(postcss([autoprefixer], cssnano))
    .pipe(gulp.dest("./dist/assets/css"));
});

gulp.task("postcss", gulp.series("postcss:prefix", "postcss:min"));

gulp.task("copy-html", () => {
  return gulp.src("./src./**./*html").pipe(gulp.dist("./dist/"));
});

gulp.task("build", gulp.parallel("postcss", "copy-html"));

gulp.task("imagemin", () => {
  return gulp
    .src("./src/assets/images/*.png")
    .pipe(imagemin())
    .pipe(gulp.dest("./dist/assets/images"));
});

gulp.task("browser-sync", function () {
  browserSync.init({
    server: {
      baseDir: "./src/",
    },
  });
  gulp
    .watch("./src/assets/sass/**/*.scss", gulp.series("sass"))
    .on("change", browserSync.reload);
  gulp.watch("src/**/.html").on("change", browserSync.reload);
});

gulp.task("scripts", function () {
  return gulp
    .src("./src/assets/js/*.js")
    .pipe(concat("valide.js"))
    .pipe(gulp.dest("./dist/assets/js"));
});
