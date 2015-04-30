var path = require('path');
var fs   = require('fs');
var mergeTrees = require('broccoli-merge-trees');
var fileRemover = require('broccoli-file-remover');

var manifest = require('./manifest');

module.exports = {
  name: 'broccoli-manifest',
  
  included: function (app) {
    this.app = app;
    this.initializeOptions();
  },
  
  initializeOptions: function () {
    var options = this.app.options.manifest || {};

    var defaultOptions = {
      enabled: this.app.env === 'production',
      appcacheFile: "/manifest.appcache",
      excludePaths: ['index.html', 'tests/'],
      includePaths: [],
      network: ['*'],
      showCreateDate: true
    }

    for (var option in defaultOptions) {
      if (!options.hasOwnProperty(option)) {
        options[option] = defaultOptions[option];
      }
    }

    this.manifestOptions = options;
  },  

  postprocessTree: function (type, tree) {
    var options = this.manifestOptions;  

    if (type === 'all' && options.enabled) {
      manifestTree = fileRemover(tree, {
        paths: options.excludePaths
      });
      return mergeTrees([tree, manifest(manifestTree, options)]);
    }

    return tree;
  },

  treeFor: function() {}
}
