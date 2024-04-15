// Corrected import statement
import * as sassLibrary from "sass";
import gulp from "gulp";
import gulpSass from "gulp-sass";
import cssnano from "gulp-cssnano";
import uglify from "gulp-uglify";
import rev from "gulp-rev";
import imagemin from "gulp-imagemin";
import del from "delete";

const sass = gulpSass(sassLibrary);

// CSS task
gulp.task("css", function () {
  console.log("minifying css...");
  return gulp
    .src("./assets/scss/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(cssnano())
    .pipe(rev())
    .pipe(gulp.dest("./public/assets/css"))
    .pipe(
      rev.manifest({
        cwd: "public",
        merge: true,
      })
    )
    .pipe(gulp.dest("./public/assets/css"));
});

// JavaScript task
gulp.task("js", () => {
  return gulp
    .src("./assets/js/*.js")
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest("./public/assets/js"))
    .pipe(
      rev.manifest({
        cwd: "public",
        merge: true,
      })
    )
    .pipe(gulp.dest("./public/assets/js"));
});

// Image optimization task
gulp.task("images", () => {
  return gulp
    .src("./assets/images/**/*.{png,jpg}")
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest("./public/assets/images"))
    .pipe(
      rev.manifest({
        cwd: "public",
        merge: true,
      })
    )
    .pipe(gulp.dest("./public/assets/images"));
});

// Clean assets task
gulp.task("clean:assets", (done) => {
  del.sync("./public/assets");
  done(); // Signal completion by invoking the callback
});

// Build task
gulp.task(
  "build",
  gulp.series(
    "clean:assets",
    "css",
    "js",
    "images",

    function (done) {
      done();
    }
  )
);
