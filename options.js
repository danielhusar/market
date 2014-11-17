// Saves options to chrome.storage.sync.
function save_options() {

  var weapons = document.getElementById('items').value;

  chrome.storage.sync.set({
    weapons: weapons
  }, function() {
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

function restore_options() {
  chrome.storage.sync.get({
    weapons: 'knife,karambit,bayonet,awp,m4a4,m4a1,ak-47,glock-18'
  }, function(data) {
    document.getElementById('items').value = data.weapons;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
