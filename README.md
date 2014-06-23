broccoli-manifest
=================

HTML5 cache-manifest compilation for broccoli

A nice introduction on the subject: http://www.html5rocks.com/en/tutorials/appcache/beginner/

Usage
-----

`npm install --save broccoli-manifest`

Use `broccoli-manifest` as your last filter in the Brocfile.js like this

```JavaScript
var writeManifest = require('broccoli-manifest');

...

var completeTree = mergeTrees([appJs, appCss, publicFiles]);

module.exports = mergeTrees([completeTree, writeManifest(completeTree)]);
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