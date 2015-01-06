broccoli-manifest
=================

HTML5 cache-manifest compilation for broccoli

A nice introduction on the subject: http://www.html5rocks.com/en/tutorials/appcache/beginner/

Usage for Ember Cli
-------------------

`npm install --save-dev broccoli-manifest`

Upgrade your `index.html` (see below) and you are done.

Usage for Broccoli.js
---------------------

`npm install --save broccoli-manifest`

Use `broccoli-manifest` as your last filter in the `Brocfile.js` like this

```JavaScript
var writeManifest = require('broccoli-manifest');

...

var completeTree = mergeTrees([appJs, appCss, publicFiles]);

module.exports = mergeTrees([completeTree, writeManifest(completeTree)]);
```

Ember-cli
---------

For a current `ember-cli` project, edit your `Brocfile.js` like this

```JavaScript
var mergeTrees = require('broccoli-merge-trees');
var writeManifest = require('broccoli-manifest');

...
  all app.import statements go here
...

// Write a html5 manifest.appcache file
var completeTree = app.toTree();
module.exports = mergeTrees([completeTree, writeManifest(completeTree)]);
```

In case you do not have `mergeTrees`, just run `npm install --save broccoli-merge-trees`

### External Files


```JavaScript
var mergeTrees = require('broccoli-merge-trees');
var manifest = require('broccoli-manifest');

...
  all app.import statements go here
...

// Write a html5 manifest.appcache file with jquery external
var completeTree = app.toTree();
var manifestTree = manifest(completree)
manifestTree.addExternalFile("https://code.jquery.com/jquery-2.1.1.min.js")

module.exports = mergeTrees([completeTree, manifestTree]);
```



Upgrade your index.html
-----------------------

Add `manifest="manifest.appcache"` to your `<html>` tag. The extra `<script>` tag
adds an eventlistener which automatically refreshes your page after a cache update.

Another approach is using this gist https://gist.github.com/ef4/82f37eb5dae4e56467b6
which loads all files stated in the manifest file.

```HTML
<!DOCTYPE html>
<html manifest="manifest.appcache">
<head>
  <script type='text/javascript'>window.addEventListener('load',function(e){window.applicationCache.addEventListener('updateready',function(e){if (window.applicationCache.status==window.applicationCache.UPDATEREADY){window.applicationCache.swapCache();window.location.reload();}},false);},false);</script>

  ...
```
