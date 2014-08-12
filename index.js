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
  this.fallback = options.fallback || [];
};

module.exports = BroccoliManifest;
BroccoliManifest.prototype = Object.create(brocWriter.prototype);
BroccoliManifest.prototype.constructor = BroccoliManifest;
BroccoliManifest.prototype.description = "Creates an manifest.appcache file for your project";

BroccoliManifest.prototype.write = function(readTree, destDir) {
  var appcacheFile = this.appcacheFile;
  var fallback = this.fallback;
  return readTree(this.inTree).then(function (srcDir) {
    var lines = ["CACHE MANIFEST", "# created " + (new Date()).toISOString(), "", "CACHE:"];

    getFilesRecursively(srcDir, [ "**/*" ]).forEach(function (file) {
      var srcFile = path.join(srcDir, file);
      var stat = fs.lstatSync(srcFile);

      if (!stat.isFile() && !stat.isSymbolicLink())
        return;

      lines.push(file);
    });

    if (fallback.length) {
      lines.push("", "FALLBACK:");
      lines.push.apply(lines, fallback);
    }

    lines.push("","NETWORK:","*");

    fs.writeFileSync(path.join(destDir, appcacheFile), lines.join("\n"));
  });
};

function getFilesRecursively(dir, globPatterns) {
  return helpers.multiGlob(globPatterns, { cwd: dir });
}

