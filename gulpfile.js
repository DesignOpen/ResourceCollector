var gulp = require('gulp');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');
var stylus = require('gulp-stylus');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var transform = require('vinyl-transform');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var browserSync = require('browser-sync');
var server = require('gulp-develop-server');
var filter = require('gulp-filter');
var mocha = require('gulp-spawn-mocha');
var testem = require('gulp-testem');
var http = require('http');

var config = {
  src: {
    styles: './src/stylesheets/',
    javascript: './src/javascripts/'
  },
  dest: {
    styles: './public/stylesheets/',
    javascript: './public/javascripts/'
  },
  serverFiles: [
    './routes/*.js',
    './app.js'
  ]
};

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

var options = {
  server: {
    path: './bin/www',
    execArgv: [ '--harmony' ]
  },
  browserSync: {
    proxy: "http://localhost:3000",
    files: ["public/**/*.*"],
    browser: "google chrome",
    port: 5000
  }
}

gulp.task('server:start', function(){
  server.listen(options.server, function(err){
    if(!err){
      browserSync(options.browserSync);
    }
  });
});

gulp.task('server:restart', function(){
  server.restart(function(err){
    if(!err){
      browserSync.reload();
    }
  });
})

gulp.task('scripts', function() {
  return gulp.src([config.src.javascript+'*.js', '!./src/javascripts/form.js'])
    .pipe(replace('%HOSTNAME%', 'osdrc.herokuapp.com'))
    .pipe(gutil.env.type === 'debug' ? sourcemaps.init() : gutil.noop())
    .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
    .pipe(gutil.env.type === 'debug' ? sourcemaps.write('.') : gutil.noop())
    .pipe(gulp.dest(config.dest.javascript));
});

gulp.task('styles', function() {
  return gulp.src(config.src.styles+'*.styl')
    .pipe(sourcemaps.init())
    .pipe(stylus({compress: (gutil.env.type === 'production')}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.dest.styles))
    .pipe(gutil.env.type === 'debug' ? filter('**/*.css') : gutil.noop())
    .pipe(gutil.env.type === 'debug' ? browserSync.reload({stream:true}) : gutil.noop());
});

gulp.task('form', function() {
  browserify(config.src.javascript+'form.js', { debug: (gutil.env.type === 'debug') })
    .transform('reactify')
    .bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('form.js'))
    .pipe(buffer())
    .pipe(gutil.env.type === 'debug' ? gutil.noop() : uglify())
    .pipe(gulp.dest(config.dest.javascript))
    .pipe(gutil.env.type === 'debug' ? browserSync.reload({stream:true}) : gutil.noop());
});

gulp.task('test:compile', function(){
  browserify(['./test/client/test-form.js'])
    .transform('reactify')
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./test/client/'));
})

gulp.task('coverage', function () {
  var coverageServer = http.createServer(function (req, resp) {
    req.pipe(fs.createWriteStream('coverage.json'))
    resp.end()
  });

  var port = 7358;
  coverageServer.listen(port);
  console.log("Coverage Server Started on port", port);
});

gulp.task('test:client', ['test:compile', 'coverage'],function(){
  gulp.src([''])
    .pipe(testem({
      configFile: 'testem.json'
    }));
});

gulp.task('test:server', function(){
  return gulp.src('./test/server/*.js')
    .pipe(mocha({
      reporter: 'nyan',
      env: {
        //Github doesn't allow pushing public keys here
        //So you can either put your own Github public key or copy paste the key from test/server/test-api.js
        //Otherwise the api test will crash.
        'github_key': '<----- INSERT PUBLIC KEY HERE ----->',
        'github_repo': 'osdrc-testing/PRtesting'
        }
      }))
    .on('error', handleError);
})

gulp.task('build', ['styles', 'scripts', 'form']);
gulp.task('test', ['test:server', 'test:client']);
gulp.task('default', ['scripts', 'form', 'styles', 'server:start'], function(){
  gulp.watch(config.src.javascript+"**/*.js", ['form', 'scripts']);
  gulp.watch(config.src.styles+"*.styl", ['styles']);
  gulp.watch(config.serverFiles, ['server:restart'])
});
