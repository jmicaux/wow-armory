(function () {
  var form = document.getElementById('options-form');
  var region = document.getElementById('region');
  var locale = document.getElementById('locale');
  var realm = document.getElementById('realm');
  var character = document.getElementById('character');
  var status = document.getElementById('status');

  function fillForm(settings) {
    region.value = settings.region;
    locale.value = settings.locale;
    realm.value = settings.realm;
    character.value = settings.character;
  }

  WowArmory.getSettings().then(fillForm);

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    WowArmory.saveSettings({
      region: region.value,
      locale: locale.value,
      realm: realm.value,
      character: character.value
    }).then(function () {
      status.textContent = 'Options saved.';
      status.classList.remove('is-error');
    }).catch(function (error) {
      status.textContent = error.message;
      status.classList.add('is-error');
    });
  });
}());
