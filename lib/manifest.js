var fs = require("fs");
var path = require('path');
var brocWriter = require("broccoli-writer");
var helpers = require("broccoli-kitchen-sink-helpers");

var BroccoliManifest = function BroccoliManifest(inTree, options) {
  if (!(this instanceof BroccoliManifest)) {
    return new BroccoliManifest(inTree, options);
  }
  this.inTree = inTree;
  options = options || {};
  this.appcacheFile = options.appcacheFile || "/manifest.appcache";
  this.includePaths = options.includePaths || [];

  this.network = options.network || ['*'];
  this.fallback = options.fallback || [];
  this.pathPrefix = options.pathPrefix || '';
  this.showCreateDate = options.showCreateDate;
};

BroccoliManifest.prototype = Object.create(brocWriter.prototype);
BroccoliManifest.prototype.constructor = BroccoliManifest;

BroccoliManifest.prototype.write = function(readTree, destDir) {
  var appcacheFile = this.appcacheFile;
  var includePaths = this.includePaths;
  var network = this.network;
  var fallback = this.fallback;
  var pathPrefix = this.pathPrefix;
  var showCreateDate = this.showCreateDate;
  return readTree(this.inTree).then(function (srcDir) {
    var lines = ["CACHE MANIFEST"];

    if (showCreateDate) {
      lines.push("# created " + (new Date()).toISOString());
    } else {
      lines.push("# " + Math.random().toString(36).substr(2));
    }

    lines.push("", "CACHE:");

    getFilesRecursively(srcDir, [ "**/*" ]).forEach(function (file) {
      var srcFile = path.join(srcDir, file);
      var stat = fs.lstatSync(srcFile);

      if (!stat.isFile() && !stat.isSymbolicLink())
        return;

      lines.push(pathPrefix + file);
    });

    includePaths.forEach(function (file) {
      lines.push(pathPrefix + file);
    });

    lines.push("","NETWORK:");

    network.forEach(function (line) {
      lines.push(line);
    });

    if (fallback.length) {
      lines.push("", "FALLBACK:");
      lines.push.apply(lines, fallback);
    }

    fs.writeFileSync(path.join(destDir, appcacheFile), lines.join("\n"));
  });
};

BroccoliManifest.prototype.addExternalFile = function(file) {
  this.externalFiles.push(file);
}

function getFilesRecursively(dir, globPatterns) {
  return helpers.multiGlob(globPatterns, { cwd: dir });
}

module.exports = BroccoliManifest;
