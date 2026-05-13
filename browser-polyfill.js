(function () {
  if (typeof globalThis.browser !== 'undefined') {
    return;
  }

  globalThis.browser = {
    storage: {
      sync: {
        get: function (defaults) {
          return new Promise(function (resolve) {
            chrome.storage.sync.get(defaults, resolve);
          });
        },
        set: function (values) {
          return new Promise(function (resolve) {
            chrome.storage.sync.set(values, resolve);
          });
        }
      }
    },
    runtime: {
      openOptionsPage: function () {
        return new Promise(function (resolve) {
          chrome.runtime.openOptionsPage(resolve);
        });
      }
    }
  };
}());
