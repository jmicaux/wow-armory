var WowArmory = (function () {
  var defaults = {
    region: 'eu',
    realm: 'archimonde',
    character: 'Poilgrîs',
    locale: 'fr-fr'
  };

  var supportedLocales = [
    'en-us',
    'en-gb',
    'fr-fr',
    'de-de',
    'es-es',
    'es-mx',
    'it-it',
    'pt-br',
    'ru-ru',
    'ko-kr',
    'zh-tw'
  ];

  var CHARACTER_CACHE_TTL_MS = 30 * 60 * 1000;
  var CHARACTER_STALE_TTL_MS = 24 * 60 * 60 * 1000;
  var FORCE_REFRESH_COOLDOWN_MS = 30 * 1000;
  var pendingCharacterRequests = {};

  function cleanSlug(value) {
    return String(value || '').trim().toLowerCase().replace(/\s+/g, '-');
  }

  function cleanName(value) {
    return String(value || '').trim();
  }

  function cleanLocale(value) {
    var locale = String(value || '').trim().toLowerCase();
    return supportedLocales.indexOf(locale) >= 0 ? locale : defaults.locale;
  }

  function getSettings() {
    return browser.storage.sync.get(defaults).then(function (settings) {
      return {
        region: settings.region || defaults.region,
        realm: cleanSlug(settings.realm || defaults.realm),
        character: cleanName(settings.character || defaults.character),
        locale: cleanLocale(settings.locale || defaults.locale)
      };
    });
  }

  function saveSettings(settings) {
    return browser.storage.sync.set({
      region: settings.region,
      realm: cleanSlug(settings.realm),
      character: cleanName(settings.character),
      locale: cleanLocale(settings.locale || defaults.locale)
    });
  }

  function characterUrl(settings) {
    var params = new URLSearchParams({
      region: settings.region,
      realm: cleanSlug(settings.realm),
      name: cleanName(settings.character),
      fields: [
        'gear',
        'guild',
        'raid_progression',
        'mythic_plus_scores_by_season:current'
      ].join(',')
    });

    return 'https://raider.io/api/v1/characters/profile?' + params.toString();
  }

  function cacheGet(key) {
    return browser.storage.local.get(key).then(function (items) {
      return items[key] || null;
    });
  }

  function cacheSet(key, value) {
    var item = {};
    item[key] = value;
    return browser.storage.local.set(item).then(function () {
      return value && value.data;
    });
  }

  function loadCached(key, ttlMs, fetcher, staleTtlMs) {
    return cacheGet(key).then(function (cached) {
      if (isFresh(cached, ttlMs)) {
        return cached.data;
      }

      return fetcher()
        .then(function (data) {
          return cacheSet(key, {
            fetchedAt: Date.now(),
            data: data
          }).then(function () {
            return data;
          });
        })
        .catch(function (error) {
          if (isFresh(cached, staleTtlMs || ttlMs)) {
            return cached.data;
          }

          throw error;
        });
    });
  }

  function characterCacheKey(settings) {
    return [
      'character',
      cleanSlug(settings.region),
      cleanSlug(settings.realm),
      cleanName(settings.character).toLowerCase(),
      cleanLocale(settings.locale)
    ].join(':');
  }

  function characterRefreshKey(settings) {
    return characterCacheKey(settings) + ':refresh';
  }

  function isFresh(entry, ttlMs) {
    return entry && entry.data && Date.now() - entry.fetchedAt < ttlMs;
  }

  function fetchCharacter(settings) {
    return fetch(characterUrl(settings), {
      headers: {
        accept: 'application/json'
      }
    }).then(function (response) {
      return response.json().then(function (data) {
        if (!response.ok) {
          throw new Error(data.message || 'Unable to load character.');
        }
        return data;
      });
    });
  }

  function officialProfileUrl(settings) {
    return [
      'https://worldofwarcraft.blizzard.com/' + cleanLocale(settings.locale) + '/character',
      encodeURIComponent(settings.region),
      encodeURIComponent(cleanSlug(settings.realm)),
      encodeURIComponent(cleanName(settings.character))
    ].join('/');
  }

  function loadCharacter(settings, options) {
    var cacheKey = characterCacheKey(settings);
    var refreshKey = characterRefreshKey(settings);
    var forceRefresh = Boolean(options && options.forceRefresh);

    if (pendingCharacterRequests[cacheKey]) {
      return pendingCharacterRequests[cacheKey];
    }

    pendingCharacterRequests[cacheKey] = cacheGet(cacheKey).then(function (cached) {
      if (!forceRefresh && isFresh(cached, CHARACTER_CACHE_TTL_MS)) {
        return cached.data;
      }

      return cacheGet(refreshKey).then(function (lastRefresh) {
        if (
          forceRefresh &&
          lastRefresh &&
          Date.now() - lastRefresh.fetchedAt < FORCE_REFRESH_COOLDOWN_MS &&
          cached &&
          cached.data
        ) {
          return cached.data;
        }

        return fetchCharacter(settings)
          .then(function (data) {
            return Promise.all([
              cacheSet(cacheKey, {
                fetchedAt: Date.now(),
                data: data
              }),
              forceRefresh ? cacheSet(refreshKey, { fetchedAt: Date.now(), data: true }) : Promise.resolve()
            ]).then(function () {
              return data;
            });
          })
          .catch(function (error) {
            if (isFresh(cached, CHARACTER_STALE_TTL_MS)) {
              return cached.data;
            }

            throw error;
          });
      });
    }).finally(function () {
      delete pendingCharacterRequests[cacheKey];
    });

    return pendingCharacterRequests[cacheKey];
  }

  return {
    defaults: defaults,
    cleanSlug: cleanSlug,
    cleanName: cleanName,
    cleanLocale: cleanLocale,
    getSettings: getSettings,
    saveSettings: saveSettings,
    loadCharacter: loadCharacter,
    officialProfileUrl: officialProfileUrl,
    loadCached: loadCached
  };
}());
