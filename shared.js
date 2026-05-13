var WowArmory = (function () {
  var defaults = {
    region: 'eu',
    realm: 'archimonde',
    character: 'Poilgrês',
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

  function officialProfileUrl(settings) {
    return [
      'https://worldofwarcraft.blizzard.com/' + cleanLocale(settings.locale) + '/character',
      encodeURIComponent(settings.region),
      encodeURIComponent(cleanSlug(settings.realm)),
      encodeURIComponent(cleanName(settings.character))
    ].join('/');
  }

  function loadCharacter(settings) {
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

  return {
    defaults: defaults,
    cleanSlug: cleanSlug,
    cleanName: cleanName,
    cleanLocale: cleanLocale,
    getSettings: getSettings,
    saveSettings: saveSettings,
    loadCharacter: loadCharacter,
    officialProfileUrl: officialProfileUrl
  };
}());
