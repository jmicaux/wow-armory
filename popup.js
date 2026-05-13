(function () {
  var form = document.getElementById('character-form');
  var region = document.getElementById('region');
  var realm = document.getElementById('realm');
  var character = document.getElementById('character');
  var status = document.getElementById('status');
  var refreshButton = document.getElementById('refresh-button');
  var optionsButton = document.getElementById('options-button');
  var profile = document.getElementById('profile');
  var fallbackProfile = document.getElementById('fallback-profile');
  var fallbackName = document.getElementById('fallback-name');
  var fallbackMeta = document.getElementById('fallback-meta');
  var fallbackOfficialLink = document.getElementById('fallback-official-link');
  var avatar = document.getElementById('avatar');
  var profileName = document.getElementById('profile-name');
  var profileMeta = document.getElementById('profile-meta');
  var profileGuild = document.getElementById('profile-guild');
  var itemLevel = document.getElementById('item-level');
  var achievements = document.getElementById('achievements');
  var mplusScore = document.getElementById('mplus-score');
  var profileLink = document.getElementById('profile-link');
  var officialLink = document.getElementById('official-link');

  function setStatus(message, isError) {
    status.textContent = message;
    status.classList.toggle('is-error', Boolean(isError));
  }

  function currentSettings() {
    return {
      region: region.value,
      realm: realm.value,
      character: character.value
    };
  }

  function fillForm(settings) {
    region.value = settings.region;
    realm.value = settings.realm;
    character.value = settings.character;
  }

  function getScore(data) {
    var seasons = data.mythic_plus_scores_by_season || [];
    if (!seasons.length) {
      return '-';
    }
    var score = seasons[0].scores && seasons[0].scores.all;
    return typeof score === 'number' ? Math.round(score) : '-';
  }

  function renderProfile(data) {
    avatar.src = data.thumbnail_url || 'assets/icon-128.png';
    avatar.alt = data.name + ' avatar';
    profileName.textContent = data.name;
    profileMeta.textContent = [
      data.active_spec_name,
      data.class,
      data.race,
      data.faction
    ].filter(Boolean).join(' · ');
    profileGuild.textContent = data.guild && data.guild.name ? '<' + data.guild.name + '>' : '';
    itemLevel.textContent = data.gear && data.gear.item_level_equipped ? data.gear.item_level_equipped : '-';
    achievements.textContent = data.achievement_points || '-';
    mplusScore.textContent = getScore(data);
    profileLink.href = data.profile_url || '#';
    officialLink.href = WowArmory.officialProfileUrl({
      region: data.region || currentSettings().region,
      realm: data.realm || currentSettings().realm,
      character: data.name || currentSettings().character
    });
  }

  function renderFallback(settings, message) {
    var officialUrl = WowArmory.officialProfileUrl(settings);
    fallbackName.textContent = settings.character;
    fallbackMeta.textContent = settings.region.toUpperCase() + ' · ' + settings.realm;
    fallbackOfficialLink.href = officialUrl;
    fallbackProfile.classList.remove('is-hidden');
    setStatus(message || 'Public profile data is unavailable.', true);
  }

  function load(settings) {
    var cleanSettings = {
      region: settings.region,
      realm: WowArmory.cleanSlug(settings.realm),
      character: WowArmory.cleanName(settings.character)
    };

    if (!cleanSettings.realm || !cleanSettings.character) {
      setStatus('Realm and character are required.', true);
      return Promise.resolve();
    }

    fillForm(cleanSettings);
    setStatus('Loading character...');
    profile.classList.add('is-hidden');
    fallbackProfile.classList.add('is-hidden');

    return WowArmory.saveSettings(cleanSettings)
      .then(function () {
        return WowArmory.loadCharacter(cleanSettings);
      })
      .then(function (data) {
        renderProfile(data);
        profile.classList.remove('is-hidden');
        setStatus('Character sheet loaded.');
      })
      .catch(function (error) {
        renderFallback(cleanSettings, error.message);
      });
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    load(currentSettings());
  });

  refreshButton.addEventListener('click', function () {
    load(currentSettings());
  });

  optionsButton.addEventListener('click', function () {
    browser.runtime.openOptionsPage();
  });

  WowArmory.getSettings().then(function (settings) {
    fillForm(settings);
    load(settings);
  });
}());
