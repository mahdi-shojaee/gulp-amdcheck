var through = require('through2');
var gutil = require('gulp-util');
var amdextract = require('amdextract');
var PluginError = gutil.PluginError;

const PLUGIN_NAME = 'gulp-amdcheck';

function gulpAmdCheck(options) {
  options = options || {};

  options.logFilePath = options.logFilePath || true;
  options.logModuleId = options.logModuleId || false;
  options.logDependencyPaths = options.logDependencyPaths || false;
  options.logDependencyNames = options.logDependencyNames || false;
  options.logUnusedDependencyPaths = options.logUnusedDependencyPaths || true;
  options.logUnusedDependencyNames = options.logUnusedDependencyNames || false;
  options.removeUnusedDependencies = options.removeUnusedDependencies || true;

  options.logFilePath = options.logFilePath || options.logDependencyPaths || options.logDependencyNames || options.logUnusedDependencyPaths || options.logUnusedDependencyNames;

  var stream = through.obj(function(file, enc, callback) {
    if (file.isNull()) {
      this.push(file);
      return callback();
    }

    if (file.isBuffer()) {
      var output = amdextract.parse(file.contents.toString(), options);

      if (options.removeUnusedDependencies) {
        file.contents = new Buffer(output.optimizedContent);
      }

      this.push(file);
      return callback();
    }

    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
      return callback();
    }
  });

  return stream;
};

module.exports = gulpAmdCheck;
