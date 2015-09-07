broccoli-manifest
=================

HTML5 cache-manifest compilation for broccoli

A nice introduction on the subject: http://www.html5rocks.com/en/tutorials/appcache/beginner/

There's also a Wicked-Good-Ember talk on this subject, see http://confreaks.tv/videos/wickedgoodember2015-taking-ember-offline

Usage for Ember Cli
-------------------

`npm install --save-dev broccoli-manifest`
`npm install --save broccoli-merge-trees`

```JavaScript
//app/config/environment.js

ENV.manifest = {
  enabled: true,
  appcacheFile: "/manifest.appcache",
  excludePaths: ['index.html', 'someother.html'],
  includePaths: ['/'],
  network: ['api/'],
  showCreateDate: true
}
````

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

Options
-------

You can pass some options as the second argument to `writeManifest`:

```JavaScript

writeManifest(completeTree, {
	appcacheFile: '/manifest.appcache', // Name of the generated appcache file - default value shown
	fallback: ['assets/is-online.json assets/offline.json'] // Lines to add to the FALLBACK section of the generated manifest
});
```

`showCreateDate` toggles the inclusion of a Date object or a random string in your manifest. If you
want to hide the build date from customers, this is your setting.

Thanks to https://github.com/racido/broccoli-manifest/pull/9 files can be filtered using
regular expressions:

```JavaScript
{
  excludePaths: ['index.html', new RegExp(/.\.map$/)],
  includePaths: ['']
}
```

### External Files


```JavaScript
var mergeTrees = require('broccoli-merge-trees');
var manifest = require('broccoli-manifest');

...
  all app.import statements go here
...

// Write a html5 manifest.appcache file with jquery external
var completeTree = app.toTree();
var manifestTree = manifest(completeTree)
manifestTree.includePaths(["https://code.jquery.com/jquery-2.1.1.min.js"])

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
