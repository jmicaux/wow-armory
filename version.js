(function () {
  var el = document.getElementById('app-version');
  if (!el) {
    return;
  }

  var version = '0.1.1';
  try {
    var runtime = (typeof browser !== 'undefined' && browser.runtime)
      || (typeof chrome !== 'undefined' && chrome.runtime);
    if (runtime && typeof runtime.getManifest === 'function') {
      var manifest = runtime.getManifest();
      if (manifest && manifest.version) {
        version = manifest.version;
      }
    }
  } catch (error) {
    /* web demo: no extension runtime, keep the fallback version */
  }

  el.textContent = 'v' + version;
}());
