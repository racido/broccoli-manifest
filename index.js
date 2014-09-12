var path = require('path');
var fs   = require('fs');

var manifest = require('./lib/manifest');

module.exports = {
  name: 'broccoli-manifest',
  initializeOptions: function() {
    var defaultOptions = {
      enabled: this.app.env === 'production',
      appcacheFile: "/manifest.appcache"
    }

    this.options = this.app.options.manifest = this.app.options.manifest || {};

    for (var option in defaultOptions) {
      if (!this.options.hasOwnProperty(option)) {
        this.options[option] = defaultOptions[option];
      }
    }
  },
  postprocessTree: function (type, tree) {
    if (type === 'all' && this.options.enabled) {
      tree = manifest(tree, this.options);
    }

    return tree;
  },
  included: function (app) {
    this.app = app;
    this.initializeOptions();
  },
  treeFor: function() {}
}