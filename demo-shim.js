/*
 * Web-demo shim.
 * Only activates when popup.html is served as a normal web page (the live
 * preview), never inside a real extension. It provides a browser.storage
 * backend on top of localStorage so the popup runs standalone. In a real
 * Chrome/Firefox extension this file is a no-op.
 */
(function () {
  var hasExtensionRuntime =
    (typeof browser !== 'undefined' && browser.runtime && browser.runtime.id) ||
    (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id);

  // Real extension, or a browser API is already present: do nothing.
  if (hasExtensionRuntime || typeof globalThis.browser !== 'undefined') {
    return;
  }

  function storageArea(prefix) {
    function read(key) {
      try {
        var raw = localStorage.getItem(prefix + key);
        return raw === null ? undefined : JSON.parse(raw);
      } catch (error) {
        return undefined;
      }
    }

    return {
      get: function (query) {
        return new Promise(function (resolve) {
          var result = {};
          if (typeof query === 'string') {
            var single = read(query);
            if (single !== undefined) {
              result[query] = single;
            }
          } else if (Array.isArray(query)) {
            query.forEach(function (key) {
              var value = read(key);
              if (value !== undefined) {
                result[key] = value;
              }
            });
          } else if (query && typeof query === 'object') {
            Object.keys(query).forEach(function (key) {
              var value = read(key);
              result[key] = value !== undefined ? value : query[key];
            });
          }
          resolve(result);
        });
      },
      set: function (values) {
        return new Promise(function (resolve) {
          Object.keys(values || {}).forEach(function (key) {
            try {
              localStorage.setItem(prefix + key, JSON.stringify(values[key]));
            } catch (error) {
              /* ignore quota / serialization errors in the demo */
            }
          });
          resolve();
        });
      }
    };
  }

  globalThis.browser = {
    storage: {
      sync: storageArea('wal:sync:'),
      local: storageArea('wal:local:')
    },
    runtime: {
      openOptionsPage: function () {
        window.open('options.html', '_blank', 'noopener');
        return Promise.resolve();
      },
      getManifest: function () {
        return { version: '0.1.1' };
      }
    }
  };
}());
