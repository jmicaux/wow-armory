(function () {
  var popup = document.querySelector('.popup');
  var form = document.getElementById('character-form');
  var locale = document.getElementById('locale');
  var region = document.getElementById('region');
  var realm = document.getElementById('realm');
  var character = document.getElementById('character');
  var status = document.getElementById('status');
  var menuButton = document.getElementById('menu-button');
  var refreshButton = document.getElementById('refresh-button');
  var profile = document.getElementById('profile');
  var fallbackProfile = document.getElementById('fallback-profile');
  var fallbackName = document.getElementById('fallback-name');
  var fallbackMeta = document.getElementById('fallback-meta');
  var fallbackOfficialLink = document.getElementById('fallback-official-link');
  var avatar = document.getElementById('avatar');
  var profileName = document.getElementById('profile-name');
  var profileMeta = document.getElementById('profile-meta');
  var profileGuild = document.getElementById('profile-guild');
  var equipmentTop = document.getElementById('equipment-top');
  var equipmentLeft = document.getElementById('equipment-left');
  var equipmentRight = document.getElementById('equipment-right');
  var equipmentWeapons = document.getElementById('equipment-weapons');
  var equipmentDetail = document.getElementById('equipment-detail');
  var profileLink = document.getElementById('profile-link');
  var officialLink = document.getElementById('official-link');
  var officialFaviconUrl = 'https://favicon.im/worldofwarcraft.blizzard.com';
  var lastProfileData = null;
  var lastFallbackSettings = null;
  var lastFallbackMessage = '';
  var localizedItemNames = {};
  var localizedItemResolved = {};
  var localizedItemRequests = {};
  var activeDetailItemKey = '';

  var i18n = {
    'en-us': {
      title: 'Armory Lite',
      openSettings: 'Open settings',
      refresh: 'Refresh',
      locale: 'Locale',
      region: 'Region',
      realm: 'Realm',
      character: 'Character',
      load: 'Load',
      statusIdle: 'Enter a character to load profile data.',
      statusLoading: 'Loading character...',
      statusLoaded: 'Character sheet loaded.',
      equipment: 'Equipment',
      inspectHint: 'Hover or focus an item to inspect details.',
      noEquipment: 'No equipment data available.',
      itemLevel: 'Item level',
      itemId: 'Item ID',
      quality: 'Quality',
      enchantsGems: 'Enchants / gems',
      bonuses: 'Bonuses',
      type: 'Type',
      openWowhead: 'Open on Wowhead',
      openRaidio: 'Open Raider.IO profile',
      openOfficial: 'Open official Armory',
      officialArmory: 'Official Armory',
      fallbackText: 'Raider.IO does not currently expose this character. You can still open the official World of Warcraft profile.',
      slotLabels: {
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
      }
    },
    'fr-fr': {
      title: 'Armory Lite',
      openSettings: 'Ouvrir les réglages',
      refresh: 'Rafraîchir',
      locale: 'Langue',
      region: 'Région',
      realm: 'Serveur',
      character: 'Personnage',
      load: 'Charger',
      statusIdle: 'Saisissez un personnage pour charger la fiche.',
      statusLoading: 'Chargement du personnage...',
      statusLoaded: 'Fiche personnage chargée.',
      equipment: 'Équipement',
      inspectHint: 'Survolez ou sélectionnez un objet pour afficher le détail.',
      noEquipment: 'Aucune donnée d’équipement disponible.',
      itemLevel: 'Niveau d’objet',
      itemId: 'ID objet',
      quality: 'Qualité',
      enchantsGems: 'Enchantements / gemmes',
      bonuses: 'Bonus',
      type: 'Type',
      openWowhead: 'Ouvrir sur Wowhead',
      openRaidio: 'Ouvrir le profil Raider.IO',
      openOfficial: 'Ouvrir l’armurerie officielle',
      officialArmory: 'Armurerie officielle',
      fallbackText: 'Raider.IO n’expose pas actuellement ce personnage. Vous pouvez toujours ouvrir le profil officiel World of Warcraft.',
      slotLabels: {
        head: 'Tête',
        neck: 'Cou',
        shoulder: 'Épaules',
        back: 'Dos',
        chest: 'Torse',
        waist: 'Taille',
        wrist: 'Poignet',
        hands: 'Mains',
        legs: 'Jambes',
        feet: 'Pieds',
        finger1: 'Doigt 1',
        finger2: 'Doigt 2',
        trinket1: 'Bijou 1',
        trinket2: 'Bijou 2',
        mainhand: 'Main droite',
        offhand: 'Main gauche'
      }
    },
    'de-de': {
      title: 'Armory Lite',
      openSettings: 'Einstellungen öffnen',
      refresh: 'Aktualisieren',
      locale: 'Sprache',
      region: 'Region',
      realm: 'Realm',
      character: 'Charakter',
      load: 'Laden',
      statusIdle: 'Gib einen Charakter ein, um das Profil zu laden.',
      statusLoading: 'Charakter wird geladen...',
      statusLoaded: 'Charakterbogen geladen.',
      equipment: 'Ausrüstung',
      inspectHint: 'Element berühren oder fokussieren, um Details zu sehen.',
      noEquipment: 'Keine Ausrüstungsdaten verfügbar.',
      itemLevel: 'Gegenstandsstufe',
      itemId: 'Gegenstands-ID',
      quality: 'Qualität',
      enchantsGems: 'Verzauberungen / Edelsteine',
      bonuses: 'Bonusse',
      type: 'Typ',
      openWowhead: 'Auf Wowhead öffnen',
      openRaidio: 'Raider.IO-Profil öffnen',
      openOfficial: 'Offizielle Armory öffnen',
      officialArmory: 'Offizielle Armory',
      fallbackText: 'Raider.IO stellt diesen Charakter derzeit nicht bereit. Du kannst weiterhin das offizielle World of Warcraft-Profil öffnen.',
      slotLabels: {
        head: 'Kopf',
        neck: 'Hals',
        shoulder: 'Schultern',
        back: 'Rücken',
        chest: 'Brust',
        waist: 'Taille',
        wrist: 'Handgelenk',
        hands: 'Hände',
        legs: 'Beine',
        feet: 'Füße',
        finger1: 'Ring 1',
        finger2: 'Ring 2',
        trinket1: 'Schmuck 1',
        trinket2: 'Schmuck 2',
        mainhand: 'Haupthand',
        offhand: 'Nebenhand'
      }
    },
    'es-es': {
      title: 'Armory Lite',
      openSettings: 'Abrir ajustes',
      refresh: 'Actualizar',
      locale: 'Idioma',
      region: 'Región',
      realm: 'Reino',
      character: 'Personaje',
      load: 'Cargar',
      statusIdle: 'Introduce un personaje para cargar el perfil.',
      statusLoading: 'Cargando personaje...',
      statusLoaded: 'Ficha cargada.',
      equipment: 'Equipo',
      inspectHint: 'Pasa el cursor o enfoca un objeto para ver los detalles.',
      noEquipment: 'No hay datos de equipo disponibles.',
      itemLevel: 'Nivel de objeto',
      itemId: 'ID de objeto',
      quality: 'Calidad',
      enchantsGems: 'Encantamientos / gemas',
      bonuses: 'Bonificaciones',
      type: 'Tipo',
      openWowhead: 'Abrir en Wowhead',
      openRaidio: 'Abrir perfil de Raider.IO',
      openOfficial: 'Abrir armadura oficial',
      officialArmory: 'Armadura oficial',
      fallbackText: 'Raider.IO no muestra actualmente este personaje. Aun así puedes abrir el perfil oficial de World of Warcraft.',
      slotLabels: {
        head: 'Cabeza',
        neck: 'Cuello',
        shoulder: 'Hombros',
        back: 'Espalda',
        chest: 'Pecho',
        waist: 'Cintura',
        wrist: 'Muñeca',
        hands: 'Manos',
        legs: 'Piernas',
        feet: 'Pies',
        finger1: 'Anillo 1',
        finger2: 'Anillo 2',
        trinket1: 'Abalorio 1',
        trinket2: 'Abalorio 2',
        mainhand: 'Mano derecha',
        offhand: 'Mano izquierda'
      }
    },
    'pt-br': {
      title: 'Armory Lite',
      openSettings: 'Abrir configurações',
      refresh: 'Atualizar',
      locale: 'Idioma',
      region: 'Região',
      realm: 'Reino',
      character: 'Personagem',
      load: 'Carregar',
      statusIdle: 'Informe um personagem para carregar o perfil.',
      statusLoading: 'Carregando personagem...',
      statusLoaded: 'Ficha carregada.',
      equipment: 'Equipamento',
      inspectHint: 'Passe o cursor ou foque um item para ver os detalhes.',
      noEquipment: 'Nenhum dado de equipamento disponível.',
      itemLevel: 'Nível do item',
      itemId: 'ID do item',
      quality: 'Qualidade',
      enchantsGems: 'Encantamentos / gemas',
      bonuses: 'Bônus',
      type: 'Tipo',
      openWowhead: 'Abrir no Wowhead',
      openRaidio: 'Abrir perfil do Raider.IO',
      openOfficial: 'Abrir armaria oficial',
      officialArmory: 'Armaria oficial',
      fallbackText: 'O Raider.IO não expõe este personagem no momento. Ainda assim, você pode abrir o perfil oficial de World of Warcraft.',
      slotLabels: {
        head: 'Cabeça',
        neck: 'Pescoço',
        shoulder: 'Ombros',
        back: 'Capa',
        chest: 'Peito',
        waist: 'Cintura',
        wrist: 'Punho',
        hands: 'Mãos',
        legs: 'Pernas',
        feet: 'Pés',
        finger1: 'Anel 1',
        finger2: 'Anel 2',
        trinket1: 'Berloque 1',
        trinket2: 'Berloque 2',
        mainhand: 'Mão principal',
        offhand: 'Mão secundária'
      }
    },
    'ru-ru': {
      title: 'Armory Lite',
      openSettings: 'Открыть настройки',
      refresh: 'Обновить',
      locale: 'Язык',
      region: 'Регион',
      realm: 'Сервер',
      character: 'Персонаж',
      load: 'Загрузить',
      statusIdle: 'Укажите персонажа, чтобы загрузить профиль.',
      statusLoading: 'Загрузка персонажа...',
      statusLoaded: 'Лист персонажа загружен.',
      equipment: 'Экипировка',
      inspectHint: 'Наведите курсор или сфокусируйте предмет, чтобы увидеть детали.',
      noEquipment: 'Данные об экипировке недоступны.',
      itemLevel: 'Уровень предмета',
      itemId: 'ID предмета',
      quality: 'Качество',
      enchantsGems: 'Чары / камни',
      bonuses: 'Бонусы',
      type: 'Тип',
      openWowhead: 'Открыть на Wowhead',
      openRaidio: 'Открыть профиль Raider.IO',
      openOfficial: 'Открыть официальный Armory',
      officialArmory: 'Официальный Armory',
      fallbackText: 'Raider.IO пока не показывает этого персонажа. Но вы можете открыть официальный профиль World of Warcraft.',
      slotLabels: {
        head: 'Голова',
        neck: 'Шея',
        shoulder: 'Плечи',
        back: 'Спина',
        chest: 'Грудь',
        waist: 'Пояс',
        wrist: 'Запястье',
        hands: 'Кисти',
        legs: 'Ноги',
        feet: 'Ступни',
        finger1: 'Кольцо 1',
        finger2: 'Кольцо 2',
        trinket1: 'Аксессуар 1',
        trinket2: 'Аксессуар 2',
        mainhand: 'Основная рука',
        offhand: 'Вторая рука'
      }
    },
    'ko-kr': {
      title: 'Armory Lite',
      openSettings: '설정 열기',
      refresh: '새로고침',
      locale: '언어',
      region: '지역',
      realm: '서버',
      character: '캐릭터',
      load: '불러오기',
      statusIdle: '캐릭터를 입력하면 프로필을 불러옵니다.',
      statusLoading: '캐릭터를 불러오는 중...',
      statusLoaded: '캐릭터 시트가 로드되었습니다.',
      equipment: '장비',
      inspectHint: '아이템에 마우스를 올리거나 포커스하면 자세한 정보를 볼 수 있습니다.',
      noEquipment: '장비 데이터가 없습니다.',
      itemLevel: '아이템 레벨',
      itemId: '아이템 ID',
      quality: '품질',
      enchantsGems: '마법부여 / 보석',
      bonuses: '보너스',
      type: '종류',
      openWowhead: 'Wowhead에서 열기',
      openRaidio: 'Raider.IO 프로필 열기',
      openOfficial: '공식 Armory 열기',
      officialArmory: '공식 Armory',
      fallbackText: 'Raider.IO에서는 아직 이 캐릭터를 제공하지 않습니다. 대신 공식 World of Warcraft 프로필을 열 수 있습니다.',
      slotLabels: {
        head: '머리',
        neck: '목',
        shoulder: '어깨',
        back: '등',
        chest: '가슴',
        waist: '허리',
        wrist: '손목',
        hands: '손',
        legs: '다리',
        feet: '발',
        finger1: '손가락 1',
        finger2: '손가락 2',
        trinket1: '장신구 1',
        trinket2: '장신구 2',
        mainhand: '주무기',
        offhand: '보조무기'
      }
    },
    'zh-tw': {
      title: 'Armory Lite',
      openSettings: '開啟設定',
      refresh: '重新整理',
      locale: '語言',
      region: '地區',
      realm: '伺服器',
      character: '角色',
      load: '載入',
      statusIdle: '輸入角色即可載入資料。',
      statusLoading: '角色載入中...',
      statusLoaded: '角色資料已載入。',
      equipment: '裝備',
      inspectHint: '將滑鼠移到物品上或聚焦即可查看詳細資訊。',
      noEquipment: '沒有可用的裝備資料。',
      itemLevel: '物品等級',
      itemId: '物品 ID',
      quality: '品質',
      enchantsGems: '附魔 / 寶石',
      bonuses: '加成',
      type: '類型',
      openWowhead: '在 Wowhead 開啟',
      openRaidio: '開啟 Raider.IO 個人檔案',
      openOfficial: '開啟官方 Armory',
      officialArmory: '官方 Armory',
      fallbackText: 'Raider.IO 目前未提供此角色資料。你仍可開啟官方 World of Warcraft 個人檔案。',
      slotLabels: {
        head: '頭部',
        neck: '頸部',
        shoulder: '肩部',
        back: '背部',
        chest: '胸部',
        waist: '腰部',
        wrist: '手腕',
        hands: '手部',
        legs: '腿部',
        feet: '腳部',
        finger1: '戒指 1',
        finger2: '戒指 2',
        trinket1: '飾品 1',
        trinket2: '飾品 2',
        mainhand: '主手',
        offhand: '副手'
      }
    }
  };

  var slotLabels = {};
  var ui = i18n['fr-fr'];

  var topSlots = [
    'head',
    'neck'
  ];

  var leftSlots = [
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
    'finger2'
  ];

  var bottomSlots = [
    'mainhand',
    'offhand',
    'trinket1',
    'trinket2'
  ];

  var equipmentSlotOrder = [
    'head',
    'neck',
    'shoulder',
    'back',
    'chest',
    'wrist',
    'hands',
    'waist',
    'legs',
    'feet',
    'finger1',
    'finger2',
    'mainhand',
    'offhand',
    'trinket1',
    'trinket2'
  ];

  function setStatus(message, isError) {
    status.textContent = message;
    status.classList.toggle('is-error', Boolean(isError));
  }

  function setIconLabel(node, iconText, label) {
    node.textContent = '';

    var icon = document.createElement('span');
    icon.className = 'button-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = iconText;
    node.appendChild(icon);

    var sr = document.createElement('span');
    sr.className = 'sr-only';
    sr.textContent = label;
    node.appendChild(sr);

    node.setAttribute('aria-label', label);
    node.setAttribute('title', label);
  }

  function setIconLink(node, iconSrc, label) {
    node.textContent = '';

    var icon = document.createElement('img');
    icon.className = 'link-favicon';
    icon.src = iconSrc;
    icon.alt = '';
    icon.setAttribute('aria-hidden', 'true');
    node.appendChild(icon);

    var sr = document.createElement('span');
    sr.className = 'sr-only';
    sr.textContent = label;
    node.appendChild(sr);

    node.setAttribute('aria-label', label);
    node.setAttribute('title', label);
  }

  function setWowheadLink(node, label) {
    node.textContent = '';

    var icon = document.createElement('img');
    icon.className = 'link-favicon';
    icon.src = 'assets/wowhead_favicon.ico';
    icon.alt = '';
    icon.setAttribute('aria-hidden', 'true');
    node.appendChild(icon);

    var text = document.createElement('span');
    text.className = 'link-text';
    text.textContent = label;
    node.appendChild(text);

    node.setAttribute('aria-label', label);
    node.setAttribute('title', label);
  }

  function localeKey() {
    return WowArmory.cleanLocale(locale.value);
  }

  function wowheadLocalePath() {
    var mapping = {
      'en-us': '',
      'en-gb': '',
      'fr-fr': 'fr',
      'de-de': 'de',
      'es-es': 'es',
      'es-mx': 'es',
      'it-it': 'it',
      'pt-br': 'pt',
      'ru-ru': 'ru',
      'ko-kr': 'kr',
      'zh-tw': 'tw'
    };

    return mapping[localeKey()] || '';
  }

  function localizedItemKey(item) {
    return localeKey() + ':' + item.item_id;
  }

  function localizedItemUrl(item) {
    var path = wowheadLocalePath();
    var base = 'https://www.wowhead.com/';
    if (path) {
      base += path + '/';
    }
    return base + 'item=' + encodeURIComponent(item.item_id) + '&xml';
  }

  function localizedItemPageUrl(item) {
    var path = wowheadLocalePath();
    var base = 'https://www.wowhead.com/';
    if (path) {
      base += path + '/';
    }
    var slug = localizedItemSlug(item);
    var href = base + 'item=' + encodeURIComponent(item.item_id);
    if (slug) {
      href += '/' + encodeURIComponent(slug);
    }
    return href;
  }

  function parseWowheadItemName(xmlText) {
    var doc = new DOMParser().parseFromString(xmlText, 'application/xml');
    if (doc.getElementsByTagName('parsererror').length) {
      return null;
    }

    var nameNode = doc.getElementsByTagName('name')[0];
    return nameNode ? String(nameNode.textContent || '').trim() : null;
  }

  function cleanWowheadPageTitle(titleText) {
    return String(titleText || '')
      .replace(/\s*-\s*Item\s*-\s*World of Warcraft.*$/i, '')
      .replace(/\s*-\s*Objet\s*-\s*World of Warcraft.*$/i, '')
      .replace(/\s*-\s*Objet\s*-\s*World of Warcraft.*$/i, '')
      .trim();
  }

  function isWowheadErrorText(value) {
    var text = String(value || '').toLowerCase();
    return !text || text.indexOf('request could not be satisfied') >= 0 || text.indexOf('error:') === 0;
  }

  function decodeWowheadText(value) {
    var text = String(value || '');

    text = text.replace(/\\u([0-9a-fA-F]{4})/g, function (_, hex) {
      return String.fromCharCode(parseInt(hex, 16));
    });

    text = text.replace(/\\x([0-9a-fA-F]{2})/g, function (_, hex) {
      return String.fromCharCode(parseInt(hex, 16));
    });

    text = text.replace(/\\'/g, "'");
    text = text.replace(/\\"/g, '"');
    text = text.replace(/\\\\/g, '\\');

    var textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  }

  function parseWowheadItemNameFromPage(htmlText) {
    var h1Match = String(htmlText || '').match(/<h1[^>]*class=["'][^"']*(?:heading-size-1|heading-title|item-name)[^"']*["'][^>]*>([^<]+)<\/h1>/i);
    if (h1Match && h1Match[1]) {
      var h1Name = cleanWowheadPageTitle(decodeWowheadText(h1Match[1]));
      return isWowheadErrorText(h1Name) ? null : h1Name;
    }

    var dataNameMatch = String(htmlText || '').match(/(?:^|[,{]\s*)(?:name|itemName)\s*:\s*["']([^"']+)["']/i);
    if (dataNameMatch && dataNameMatch[1]) {
      var dataName = cleanWowheadPageTitle(decodeWowheadText(dataNameMatch[1]));
      return isWowheadErrorText(dataName) ? null : dataName;
    }

    var titleMatch = String(htmlText || '').match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i);
    if (titleMatch && titleMatch[1]) {
      var ogName = cleanWowheadPageTitle(decodeWowheadText(titleMatch[1]));
      return isWowheadErrorText(ogName) ? null : ogName;
    }

    var pageTitleMatch = String(htmlText || '').match(/<title>([^<]+)<\/title>/i);
    if (!pageTitleMatch || !pageTitleMatch[1]) {
      return null;
    }

    var pageName = cleanWowheadPageTitle(decodeWowheadText(pageTitleMatch[1]));
    return isWowheadErrorText(pageName) ? null : pageName;
  }

  function resolveLocalizedItemName(item) {
    var key = localizedItemKey(item);
    if (!item || !item.item_id) {
      return Promise.resolve(item && item.name ? item.name : '');
    }

    if (!item.original_name && item.name) {
      item.original_name = item.name;
    }

    if (localizedItemResolved[key] && localizedItemNames[key]) {
      return Promise.resolve(localizedItemNames[key]);
    }

    if (localizedItemRequests[key]) {
      return localizedItemRequests[key];
    }

    localizedItemRequests[key] = fetch(localizedItemUrl(item), { credentials: 'omit' })
      .then(function (response) {
        return response.text();
      })
      .then(function (text) {
        var name = parseWowheadItemName(text);
        if (!name || (localeKey() !== 'en-us' && localeKey() !== 'en-gb' && item.name && name === item.name)) {
          return fetch(localizedItemPageUrl(item), { credentials: 'omit' })
            .then(function (response) {
              return response.text();
            })
            .then(function (pageText) {
              var pageName = parseWowheadItemNameFromPage(pageText);
              localizedItemNames[key] = decodeWowheadText(pageName || name || item.original_name || item.name || '');
              localizedItemResolved[key] = Boolean(localizedItemNames[key]);
              item.localized_name = localizedItemNames[key];
              item.name = localizedItemNames[key];
              return localizedItemNames[key];
            });
        }

        localizedItemNames[key] = decodeWowheadText(name || item.original_name || item.name || '');
        localizedItemResolved[key] = Boolean(localizedItemNames[key]);
        item.localized_name = localizedItemNames[key];
        item.name = localizedItemNames[key];
        return localizedItemNames[key];
      })
      .catch(function () {
        if (localeKey() === 'en-us' || localeKey() === 'en-gb') {
          localizedItemNames[key] = decodeWowheadText(item.original_name || item.name || '');
          localizedItemResolved[key] = Boolean(localizedItemNames[key]);
        }
        item.localized_name = localizedItemNames[key];
        if (localizedItemNames[key]) {
          item.name = localizedItemNames[key];
        }
        return localizedItemNames[key] || item.name || '';
      })
      .finally(function () {
        delete localizedItemRequests[key];
      });

    return localizedItemRequests[key];
  }

  function primeLocalizedItemNames(items) {
    if (!items) {
      return Promise.resolve([]);
    }

    return Promise.all(equipmentSlotOrder.map(function (slot) {
      if (items[slot]) {
        return resolveLocalizedItemName(items[slot]);
      }
      return Promise.resolve('');
    }));
  }

  function clearLocalizedItemNames(items) {
    if (!items) {
      return;
    }

    Object.keys(items).forEach(function (slot) {
      if (items[slot] && items[slot].localized_name) {
        delete items[slot].localized_name;
      }
    });
  }

  function defaultDetailSlot(items) {
    if (!items) {
      return null;
    }

    if (items.head) {
      return 'head';
    }

    for (var i = 0; i < equipmentSlotOrder.length; i += 1) {
      if (items[equipmentSlotOrder[i]]) {
        return equipmentSlotOrder[i];
      }
    }

    return null;
  }

  function currentUi() {
    return i18n[localeKey()] || i18n['en-us'];
  }

  function applyLocale() {
    ui = currentUi();
    slotLabels = ui.slotLabels;

    document.documentElement.lang = localeKey();
    document.title = ui.title;
    menuButton.setAttribute('aria-label', ui.openSettings);
    setIconLabel(refreshButton, '↻', ui.refresh);
    form.setAttribute('aria-label', ui.openSettings);
    form.querySelector('label span').textContent = ui.locale;
    form.querySelectorAll('label span')[1].textContent = ui.region;
    form.querySelectorAll('label span')[2].textContent = ui.realm;
    form.querySelectorAll('label span')[3].textContent = ui.character;
    document.querySelector('.status').textContent = ui.statusIdle;
    setIconLink(document.querySelector('#profile-link'), 'assets/raiderio_favicon.ico', ui.openRaidio);
    setIconLink(document.querySelector('#official-link'), officialFaviconUrl, ui.openOfficial);
    setIconLink(document.querySelector('#fallback-official-link'), officialFaviconUrl, ui.openOfficial);
    document.querySelector('#fallback-profile .eyebrow').textContent = ui.officialArmory;
    document.querySelector('#fallback-profile p:last-of-type').textContent = ui.fallbackText;
  }

  function itemDisplayName(item) {
    var key = item && item.item_id ? localizedItemKey(item) : '';
    return (item && item.localized_name) || (key && localizedItemNames[key]) || (item && item.name) || 'Unknown item';
  }

  function currentSettings() {
    return {
      locale: locale.value,
      region: region.value,
      realm: realm.value,
      character: character.value
    };
  }

  function fillForm(settings) {
    locale.value = settings.locale;
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

  function localizedItemSlug(item) {
    var key = item && item.item_id ? localizedItemKey(item) : '';
    var name = (item && item.localized_name) || (key && localizedItemNames[key]) || (item && item.original_name) || (item && item.name) || '';
    return name
      ? String(name)
        .trim()
        .toLowerCase()
        .replace(/[’']/g, '')
        .replace(/[^a-z0-9\u00c0-\u017f]+/g, '-')
        .replace(/^-+|-+$/g, '')
      : '';
  }

  function itemType(slot, item) {
    return detailValue(item.item_subclass || item.item_class || item.item_type || item.inventory_type) || slotLabels[slot] || slot;
  }

  function itemUrl(item) {
    if (!item || !item.item_id) {
      return '#';
    }

    var base = 'https://www.wowhead.com/';
    var path = wowheadLocalePath();
    if (path) {
      base += path + '/';
    }

    var href = base + 'item=' + encodeURIComponent(item.item_id);
    var slug = localizedItemSlug(item);
    if (slug) {
      href += '/' + encodeURIComponent(slug);
    }

    var params = [];
    if (Array.isArray(item.bonuses) && item.bonuses.length) {
      params.push('bonus=' + item.bonuses.join(':'));
    }
    if (Array.isArray(item.gems) && item.gems.length) {
      params.push('gems=' + item.gems.join(':'));
    }
    if (Array.isArray(item.enchants) && item.enchants.length) {
      params.push('ench=' + item.enchants[0]);
    }

    return params.length ? href + '?' + params.join('&') : href;
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
    empty.textContent = ui.inspectHint;
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
    activeDetailItemKey = localizedItemKey(item);
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
    title.textContent = itemDisplayName(item);
    intro.appendChild(title);

    header.appendChild(intro);
    equipmentDetail.appendChild(header);

    var lines = [
      detailLine(ui.type, itemType(slot, item)),
      detailLine(ui.itemLevel, item.item_level ? String(item.item_level) : null),
      detailLine(ui.itemId, item.item_id ? String(item.item_id) : null),
      detailLine(ui.quality, item.item_quality !== undefined ? String(item.item_quality) : null),
      detailLine(ui.enchantsGems, details.length ? details.join(' · ') : null),
      detailLine(ui.bonuses, Array.isArray(item.bonuses) && item.bonuses.length ? item.bonuses.join(', ') : null)
    ].filter(Boolean);

    var list = document.createElement('div');
    list.className = 'equipment-detail-lines';
    lines.forEach(function (line) {
      list.appendChild(line);
    });
    equipmentDetail.appendChild(list);

    var link = document.createElement('a');
    link.className = 'profile-link profile-link-secondary wowhead-link';
    link.href = itemUrl(item);
    link.target = '_blank';
    link.rel = 'noopener';
    var data = wowheadData(item);
    if (data) {
      link.setAttribute('data-wowhead', data);
      link.setAttribute('data-wh-rename-link', 'true');
    }
    setWowheadLink(link, ui.openWowhead);
    equipmentDetail.appendChild(link);

    resolveLocalizedItemName(item).then(function (name) {
      if (activeDetailItemKey === localizedItemKey(item) && name) {
        title.textContent = name;
      }
    });
  }

  function createItem(slot, item) {
    var row;

    if (item) {
      row = document.createElement('a');
      row.href = itemUrl(item);
      row.target = '_blank';
      row.rel = 'noopener';
      row.setAttribute('aria-label', (slotLabels[slot] || slot) + ': ' + itemDisplayName(item));
      row.title = itemDisplayName(item);
      var data = wowheadData(item);
      if (data) {
        row.setAttribute('data-wowhead', data);
        row.setAttribute('data-wh-rename-link', 'true');
      }
    } else {
      row = document.createElement('div');
      row.setAttribute('aria-label', slotLabels[slot] || slot);
      row.title = slotLabels[slot] || slot;
      row.classList.add('is-empty');
    }

    row.classList.add('equipment-item');
    row.classList.add(qualityClass(item || {}));

    var image = document.createElement('img');
    image.src = item ? iconUrl(item.icon) : 'assets/icon-48.png';
    image.alt = '';
    image.width = 40;
    image.height = 40;
    row.appendChild(image);

    var label = document.createElement('span');
    label.className = 'equipment-slot';
    label.textContent = slotLabels[slot] || slot;
    row.appendChild(label);

    if (item) {
      row.addEventListener('mouseenter', function () {
        showItemDetails(slot, item);
      });
      row.addEventListener('focus', function () {
        showItemDetails(slot, item);
      });
      resolveLocalizedItemName(item).then(function (name) {
        if (name) {
          row.setAttribute('aria-label', (slotLabels[slot] || slot) + ': ' + name);
          row.title = name;
        }
      });
    }
    return row;
  }

  function renderEquipment(items) {
    equipmentTop.textContent = '';
    equipmentLeft.textContent = '';
    equipmentRight.textContent = '';
    equipmentWeapons.textContent = '';
    clearDetail();

    if (!items) {
      var empty = document.createElement('p');
      empty.className = 'equipment-empty';
      empty.textContent = ui.noEquipment;
      equipmentDetail.textContent = '';
      equipmentDetail.appendChild(empty);
      return;
    }

    topSlots.forEach(function (slot) {
      equipmentTop.appendChild(createItem(slot, items[slot] || null));
    });
    leftSlots.forEach(function (slot) {
      equipmentLeft.appendChild(createItem(slot, items[slot] || null));
    });
    rightSlots.forEach(function (slot) {
      equipmentRight.appendChild(createItem(slot, items[slot] || null));
    });
    bottomSlots.forEach(function (slot) {
      equipmentWeapons.appendChild(createItem(slot, items[slot] || null));
    });

    var defaultSlot = defaultDetailSlot(items);
    if (defaultSlot && items[defaultSlot]) {
      showItemDetails(defaultSlot, items[defaultSlot]);
    }
  }

  function renderProfile(data) {
    lastProfileData = data;
    lastFallbackSettings = null;
    lastFallbackMessage = '';
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
    profileLink.href = data.profile_url || '#';
    officialLink.href = WowArmory.officialProfileUrl({
      region: data.region || currentSettings().region,
      realm: data.realm || currentSettings().realm,
      character: data.name || currentSettings().character,
      locale: currentSettings().locale
    });
    return primeLocalizedItemNames(data.gear && data.gear.items).then(function () {
      renderEquipment(data.gear && data.gear.items);
      return data;
    });
  }

  function renderFallback(settings, message) {
    lastProfileData = null;
    lastFallbackSettings = settings;
    lastFallbackMessage = message || ui.fallbackText;
    var officialUrl = WowArmory.officialProfileUrl(settings);
    fallbackName.textContent = settings.character;
    fallbackMeta.textContent = settings.region.toUpperCase() + ' · ' + settings.realm;
    fallbackOfficialLink.href = officialUrl;
    fallbackProfile.classList.remove('is-hidden');
    setStatus(lastFallbackMessage, true);
  }

  function load(settings) {
    var cleanSettings = {
      region: settings.region,
      realm: WowArmory.cleanSlug(settings.realm),
      character: WowArmory.cleanName(settings.character),
      locale: WowArmory.cleanLocale(settings.locale)
    };

    if (!cleanSettings.realm || !cleanSettings.character) {
      setStatus(ui.statusIdle, true);
      return Promise.resolve();
    }

    fillForm(cleanSettings);
    setStatus(ui.statusLoading);
    status.classList.remove('is-hidden');
    profile.classList.add('is-hidden');
    fallbackProfile.classList.add('is-hidden');

    return WowArmory.saveSettings(cleanSettings)
      .then(function () {
        return WowArmory.loadCharacter(cleanSettings);
      })
      .then(function (data) {
        return renderProfile(data).then(function () {
          return data;
        });
      })
      .then(function () {
        profile.classList.remove('is-hidden');
        enableCharacterMode();
        setStatus(ui.statusLoaded);
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
    if (!form.classList.contains('is-open')) {
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

  WowArmory.getSettings().then(function (settings) {
    fillForm(settings);
    applyLocale();
    load(settings);
  });

    locale.addEventListener('change', function () {
      localizedItemNames = {};
      localizedItemResolved = {};
      localizedItemRequests = {};
      applyLocale();
      if (lastProfileData && !profile.classList.contains('is-hidden')) {
        clearLocalizedItemNames(lastProfileData.gear && lastProfileData.gear.items);
      renderProfile(lastProfileData);
    } else if (lastFallbackSettings && !fallbackProfile.classList.contains('is-hidden')) {
      renderFallback(lastFallbackSettings, lastFallbackMessage);
    }
  });
}());
