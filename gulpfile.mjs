import gulp from "gulp";
import gulpSass from "gulp-sass";
import cssnano from "gulp-cssnano";
import uglify from "gulp-uglify";
import rev from "gulp-rev";
import imagemin from "gulp-imagemin";
import del from "delete";
import * as sassLibrary from "sass";

const sass = gulpSass(sassLibrary);

// CSS Task
gulp.task("css", function () {
  return gulp
    .src("./assets/scss/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(cssnano())
    .pipe(rev())
    .pipe(gulp.dest("./public/assets")) // Saving revised CSS in a subdirectory
    .pipe(
      rev.manifest("./public/assets/rev-manifest.json", {
        base: process.cwd() + "./public/assets",
        merge: true, // Merge with existing manifest if present
      })
    )
    .pipe(gulp.dest("./public/assets")); // Saving manifest in the specified 'dist' directory
});

// JavaScript Task
gulp.task("js", function () {
  return gulp
    .src("./assets/js/**/*.js")
    .pipe(
      uglify().on("error", function (e) {
        console.error(e);
      })
    )
    .pipe(rev())
    .pipe(gulp.dest("./public/assets")) // Saving revised JS in a subdirectory
    .pipe(
      rev.manifest("./public/assets/rev-manifest.json", {
        base: process.cwd() + "./public/assets",
        merge: true,
      })
    )
    .pipe(gulp.dest("./public/assets"));
});

// Image Minification Task
gulp.task("images", function () {
  return gulp
    .src("./assets/images/**/*.{png,jpg,svg,gif,jpeg}")
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest("./public/assets")) // Saving revised images in a subdirectory
    .pipe(
      rev.manifest("./public/assets/rev-manifest.json", {
        base: process.cwd() + "./public/assets",
        merge: true,
      })
    )
    .pipe(gulp.dest("./public/assets"));
});

// Clean Task
gulp.task("clean:assets", function () {
  return del(["./public/assets", "./public/assets/rev-manifest.json"], {
    force: true,
  });
});

// Build Task
gulp.task("build", gulp.series("clean:assets", "css", "js", "images"));
