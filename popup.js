(function () {
  var popup = document.querySelector('.popup');
  var form = document.getElementById('character-form');
  var region = document.getElementById('region');
  var realm = document.getElementById('realm');
  var character = document.getElementById('character');
  var status = document.getElementById('status');
  var menuButton = document.getElementById('menu-button');
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
  var equipmentLeft = document.getElementById('equipment-left');
  var equipmentRight = document.getElementById('equipment-right');
  var equipmentWeapons = document.getElementById('equipment-weapons');
  var equipmentDetail = document.getElementById('equipment-detail');
  var profileLink = document.getElementById('profile-link');
  var officialLink = document.getElementById('official-link');
  var activeSettings = WowArmory.defaults;

  var slotLabels = {
    head: 'Head',
    neck: 'Neck',
    shoulder: 'Shoulders',
    back: 'Back',
    chest: 'Chest',
    waist: 'Waist',
    wrist: 'Wrist',
    hands: 'Hands',
    legs: 'Legs',
    feet: 'Feet',
    finger1: 'Finger 1',
    finger2: 'Finger 2',
    trinket1: 'Trinket 1',
    trinket2: 'Trinket 2',
    mainhand: 'Main hand',
    offhand: 'Off hand'
  };

  var leftSlots = [
    'head',
    'neck',
    'shoulder',
    'back',
    'chest',
    'wrist',
    'hands'
  ];

  var rightSlots = [
    'waist',
    'legs',
    'feet',
    'finger1',
    'finger2',
    'trinket1',
    'trinket2'
  ];

  var weaponSlots = [
    'mainhand',
    'offhand'
  ];

  function setStatus(message, isError) {
    status.textContent = message;
    status.classList.toggle('is-error', Boolean(isError));
  }

  function currentSettings() {
    return {
      region: region.value,
      realm: realm.value,
      character: character.value,
      locale: activeSettings.locale
    };
  }

  function fillForm(settings) {
    region.value = settings.region;
    realm.value = settings.realm;
    character.value = settings.character;
  }

  function setMenuOpen(isOpen) {
    form.classList.toggle('is-open', isOpen);
    menuButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }

  function enableCharacterMode() {
    popup.classList.add('has-character');
    setMenuOpen(false);
  }

  function getScore(data) {
    var seasons = data.mythic_plus_scores_by_season || [];
    if (!seasons.length) {
      return '-';
    }
    var score = seasons[0].scores && seasons[0].scores.all;
    return typeof score === 'number' ? Math.round(score) : '-';
  }

  function iconUrl(iconName) {
    if (!iconName) {
      return 'assets/icon-48.png';
    }
    return 'https://render.worldofwarcraft.com/eu/icons/56/' + iconName + '.jpg';
  }

  function qualityClass(item) {
    return 'quality-' + (item.item_quality || 0);
  }

  function detailNames(values) {
    if (!Array.isArray(values)) {
      return [];
    }

    return values.map(function (entry) {
      if (typeof entry === 'string') {
        return entry;
      }
      return entry && (entry.name || entry.display_string || entry.enchant || entry.id);
    }).filter(Boolean);
  }

  function detailValue(value) {
    if (!value && value !== 0) {
      return '';
    }
    if (typeof value === 'string' || typeof value === 'number') {
      return String(value);
    }
    return value.name || value.display_string || value.type || value.id || '';
  }

  function itemType(slot, item) {
    return detailValue(item.item_subclass || item.item_class || item.item_type || item.inventory_type) || slotLabels[slot] || slot;
  }

  function itemUrl(item) {
    return item && item.item_id ? 'https://www.wowhead.com/item=' + encodeURIComponent(item.item_id) : '#';
  }

  function wowheadData(item) {
    var params = [];

    if (!item || !item.item_id) {
      return '';
    }

    params.push('item=' + item.item_id);

    if (item.item_level) {
      params.push('ilvl=' + item.item_level);
    }

    if (Array.isArray(item.bonuses) && item.bonuses.length) {
      params.push('bonus=' + item.bonuses.join(':'));
    }

    if (Array.isArray(item.gems) && item.gems.length) {
      params.push('gems=' + item.gems.join(':'));
    }

    if (Array.isArray(item.enchants) && item.enchants.length) {
      params.push('ench=' + item.enchants[0]);
    }

    return params.join('&');
  }

  function clearDetail() {
    equipmentDetail.textContent = '';
    var empty = document.createElement('p');
    empty.className = 'equipment-detail-empty';
    empty.textContent = 'Hover or focus an item to inspect details.';
    equipmentDetail.appendChild(empty);
  }

  function detailLine(label, value) {
    if (!value) {
      return null;
    }

    var row = document.createElement('div');
    row.className = 'equipment-detail-line';

    var term = document.createElement('span');
    term.textContent = label;
    row.appendChild(term);

    var description = document.createElement('strong');
    description.textContent = value;
    row.appendChild(description);

    return row;
  }

  function showItemDetails(slot, item) {
    var details = detailNames(item.enchants_detail).concat(detailNames(item.gems_detail));
    equipmentDetail.textContent = '';

    var header = document.createElement('div');
    header.className = 'equipment-detail-header';

    var image = document.createElement('img');
    image.src = iconUrl(item.icon);
    image.alt = '';
    image.width = 56;
    image.height = 56;
    header.appendChild(image);

    var intro = document.createElement('div');

    var slotLabel = document.createElement('p');
    slotLabel.className = 'equipment-detail-slot';
    slotLabel.textContent = slotLabels[slot] || slot;
    intro.appendChild(slotLabel);

    var title = document.createElement('h4');
    title.className = 'equipment-detail-name ' + qualityClass(item);
    title.textContent = item.name || 'Unknown item';
    intro.appendChild(title);

    header.appendChild(intro);
    equipmentDetail.appendChild(header);

    var lines = [
      detailLine('Type', itemType(slot, item)),
      detailLine('Item level', item.item_level ? String(item.item_level) : null),
      detailLine('Item ID', item.item_id ? String(item.item_id) : null),
      detailLine('Quality', item.item_quality !== undefined ? String(item.item_quality) : null),
      detailLine('Enchants / gems', details.length ? details.join(' · ') : null),
      detailLine('Bonuses', Array.isArray(item.bonuses) && item.bonuses.length ? item.bonuses.join(', ') : null)
    ].filter(Boolean);

    var list = document.createElement('div');
    list.className = 'equipment-detail-lines';
    lines.forEach(function (line) {
      list.appendChild(line);
    });
    equipmentDetail.appendChild(list);

    var link = document.createElement('a');
    link.className = 'profile-link profile-link-secondary';
    link.href = itemUrl(item);
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = 'Open on Wowhead';
    var data = wowheadData(item);
    if (data) {
      link.setAttribute('data-wowhead', data);
      link.setAttribute('data-wh-rename-link', 'true');
    }
    equipmentDetail.appendChild(link);
  }

  function createItem(slot, item) {
    var row = document.createElement('a');
    row.className = 'equipment-item ' + qualityClass(item);
    row.href = itemUrl(item);
    row.target = '_blank';
    row.rel = 'noopener';
    row.setAttribute('aria-label', (slotLabels[slot] || slot) + ': ' + (item.name || 'Unknown item'));
    var data = wowheadData(item);
    if (data) {
      row.setAttribute('data-wowhead', data);
      row.setAttribute('data-wh-rename-link', 'true');
    }

    var image = document.createElement('img');
    image.src = iconUrl(item.icon);
    image.alt = '';
    image.width = 40;
    image.height = 40;
    row.appendChild(image);

    var label = document.createElement('span');
    label.className = 'equipment-slot';
    label.textContent = slotLabels[slot] || slot;
    row.appendChild(label);

    row.addEventListener('mouseenter', function () {
      showItemDetails(slot, item);
    });
    row.addEventListener('focus', function () {
      showItemDetails(slot, item);
    });
    return row;
  }

  function renderEquipment(items) {
    equipmentLeft.textContent = '';
    equipmentRight.textContent = '';
    equipmentWeapons.textContent = '';
    clearDetail();

    if (!items) {
      var empty = document.createElement('p');
      empty.className = 'equipment-empty';
      empty.textContent = 'No equipment data available.';
      equipmentDetail.textContent = '';
      equipmentDetail.appendChild(empty);
      return;
    }

    leftSlots.forEach(function (slot) {
      if (items[slot]) {
        equipmentLeft.appendChild(createItem(slot, items[slot]));
      }
    });
    rightSlots.forEach(function (slot) {
      if (items[slot]) {
        equipmentRight.appendChild(createItem(slot, items[slot]));
      }
    });
    weaponSlots.forEach(function (slot) {
      if (items[slot]) {
        equipmentWeapons.appendChild(createItem(slot, items[slot]));
      }
    });
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
    renderEquipment(data.gear && data.gear.items);
    profileLink.href = data.profile_url || '#';
    officialLink.href = WowArmory.officialProfileUrl({
      region: data.region || currentSettings().region,
      realm: data.realm || currentSettings().realm,
      character: data.name || currentSettings().character,
      locale: currentSettings().locale
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
      character: WowArmory.cleanName(settings.character),
      locale: WowArmory.cleanLocale(settings.locale)
    };

    if (!cleanSettings.realm || !cleanSettings.character) {
      setStatus('Realm and character are required.', true);
      return Promise.resolve();
    }

    fillForm(cleanSettings);
    activeSettings = cleanSettings;
    setStatus('Loading character...');
    status.classList.remove('is-hidden');
    profile.classList.add('is-hidden');
    fallbackProfile.classList.add('is-hidden');

    return WowArmory.saveSettings(cleanSettings)
      .then(function () {
        return WowArmory.loadCharacter(cleanSettings);
      })
      .then(function (data) {
        renderProfile(data);
        profile.classList.remove('is-hidden');
        enableCharacterMode();
        setStatus('Character sheet loaded.');
        status.classList.add('is-hidden');
      })
      .catch(function (error) {
        renderFallback(cleanSettings, error.message);
        enableCharacterMode();
      });
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    load(currentSettings());
  });

  menuButton.addEventListener('click', function () {
    setMenuOpen(!form.classList.contains('is-open'));
  });

  document.addEventListener('click', function (event) {
    if (!popup.classList.contains('has-character') || !form.classList.contains('is-open')) {
      return;
    }

    if (!form.contains(event.target) && !menuButton.contains(event.target)) {
      setMenuOpen(false);
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && form.classList.contains('is-open')) {
      setMenuOpen(false);
      menuButton.focus();
    }
  });

  refreshButton.addEventListener('click', function () {
    load(currentSettings());
  });

  optionsButton.addEventListener('click', function () {
    browser.runtime.openOptionsPage();
  });

  WowArmory.getSettings().then(function (settings) {
    activeSettings = settings;
    fillForm(settings);
    load(settings);
  });
}());
