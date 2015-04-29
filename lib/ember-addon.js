var path = require('path');
var fs   = require('fs');
var mergeTrees = require('broccoli-merge-trees');
var funnel = require('broccoli-funnel');

var manifest = require('./manifest');

module.exports = {
  name: 'broccoli-manifest',

  config: function(environment, appConfig) {
    var options = appConfig.manifest || {};
    var defaultOptions = {
      enabled: appConfig.environment === 'production',
      appcacheFile: "/manifest.appcache",
      excludePaths: ['index.html', 'tests/'],
      includePaths: [],
      network: ['*']
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
      manifestTree = funnel(tree, {
        exclude: options.excludePaths
      });
      return mergeTrees([tree, manifest(manifestTree, options)]);
    }

    return tree;
  },

  treeFor: function() {}
}
