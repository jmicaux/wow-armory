(function () {
  var form = document.getElementById('options-form');
  var region = document.getElementById('region');
  var realm = document.getElementById('realm');
  var character = document.getElementById('character');
  var status = document.getElementById('status');

  function fillForm(settings) {
    region.value = settings.region;
    realm.value = settings.realm;
    character.value = settings.character;
  }

  WowArmory.getSettings().then(fillForm);

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    WowArmory.saveSettings({
      region: region.value,
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
