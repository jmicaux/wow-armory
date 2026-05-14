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

  function parseOfficialProfile(htmlText) {
    var marker = 'var characterProfileInitialState = ';
    var start = String(htmlText || '').indexOf(marker);
    var end;
    var jsonText;
    var state;
    var character;

    if (start < 0) {
      return {};
    }

    start += marker.length;
    end = htmlText.indexOf('</script>', start);
    if (end < 0) {
      return {};
    }

    jsonText = htmlText.slice(start, end).replace(/;\s*$/, '');

    try {
      state = JSON.parse(jsonText);
    } catch (error) {
      return {};
    }

    character = state && state.character;
    if (!character) {
      return {};
    }

    return {
      level: character.level || null,
      achievement_points: character.achievement || null,
      guild: character.guild && character.guild.name ? { name: character.guild.name } : null
    };
  }

  function loadOfficialProfile(settings) {
    return fetch(officialProfileUrl(settings), {
      credentials: 'omit'
    }).then(function (response) {
      if (!response.ok) {
        return {};
      }

      return response.text().then(parseOfficialProfile);
    }).catch(function () {
      return {};
    });
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
    }).then(function (data) {
      return loadOfficialProfile(settings).then(function (officialData) {
        return Object.assign({}, data, {
          level: data.level || officialData.level,
          achievement_points: data.achievement_points || officialData.achievement_points,
          guild: data.guild || officialData.guild
        });
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
