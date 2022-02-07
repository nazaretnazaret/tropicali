const { watch, series, src, dest } = require("gulp");

// css
const cleanCSS = require("gulp-clean-css");
const postCSS = require("gulp-postcss");
var sourcemaps = require("gulp-sourcemaps");
const concat = require("gulp-concat");

// browser refresh
var browserSync = require("browser-sync").create();

// images
var imagemin = require("gulp-imagemin");

// github
var ghpages = require("gh-pages");

function runCSS() {
  // place code for your default task here
  // we want to run "css css/app.scss app.css --watch"
  return src(["src/css/reset.css", "src/css/typography.css", "src/css/app.css"])
    .pipe(sourcemaps.init())
    .pipe(
      postCSS([
        require("autoprefixer"),
        require("postcss-preset-env")({
          stage: 1,
          browsers: ["IE 11", "last 2 versions"],
        }),
      ])
    )
    .pipe(concat("app.css"))
    .pipe(
      cleanCSS({
        compatibility: "ie8",
      })
    )
    .pipe(sourcemaps.write())
    .pipe(dest("dist"))
    .pipe(browserSync.stream());
}

function html() {
  return src("src/*.html").pipe(dest("dist"));
}

function fonts() {
  return src("src/fonts/*").pipe(dest("dist/fonts"));
}

function images() {
  return src("src/img/*").pipe(imagemin()).pipe(dest("dist/img"));
}

function watchCSS() {
  browserSync.init({
    server: {
      baseDir: "dist",
    },
  });
  watch("src/*.html", html).on("change", browserSync.reload);
  watch("src/css/*", runCSS);
  watch("src/fonts/*", fonts);
  watch("src/img/*", images);
}

function deploy() {
  return ghpages.publish("dist");
}

exports.default = series(html, fonts, images, runCSS, watchCSS);

exports.deploy = deploy;
