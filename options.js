(function () {
  'use strict';

  function saveOptions () {
    var weapons = document.getElementById('items').value;
    var rate = document.getElementById('rate').value;

    chrome.storage.sync.set({
      weapons: weapons,
      rate: rate
    }, function () {
      var status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(function () {
        status.textContent = '';
      }, 750);
    });
  }

  function restoreOptions () {
    chrome.storage.sync.get({
      weapons: 'knife,karambit,bayonet,awp,m4a4,m4a1,ak-47,glock-18',
      rate: 200
    }, function (data) {
      document.getElementById('items').value = data.weapons;
      document.getElementById('rate').value = data.rate;
    });
  }

  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.getElementById('save').addEventListener('click', saveOptions);

})();
