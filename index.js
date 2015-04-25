var through = require('through2');
var gutil = require('gulp-util');
var amdextract = require('amdextract');
var PluginError = gutil.PluginError;

const PLUGIN_NAME = 'gulp-amdcheck';

function isUndefined(object) {
  return object === undefined;
}

function gulpAmdCheck(options) {
  options = options || {};

  options.logFilePath = isUndefined(options.logFilePath) ? true : options.logFilePath;
  options.logModuleId = isUndefined(options.logModuleId) ? false : options.logModuleId;
  options.logDependencyPaths = isUndefined(options.logDependencyPaths) ? false : options.logDependencyPaths;
  options.logDependencyNames = isUndefined(options.logDependencyNames) ? false : options.logDependencyNames;
  options.logUnusedDependencyPaths = isUndefined(options.logUnusedDependencyPaths) ? true : options.logUnusedDependencyPaths;
  options.logUnusedDependencyNames = isUndefined(options.logUnusedDependencyNames) ? false : options.logUnusedDependencyNames;
  options.removeUnusedDependencies = isUndefined(options.removeUnusedDependencies) ? true : options.removeUnusedDependencies;

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
