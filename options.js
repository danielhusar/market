// Saves options to chrome.storage.sync.
function save_options() {

  var items = document.getElementById('items').value;

  chrome.storage.sync.set({
    items: items
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
    items: 'knife,karambit,bayonet,awp,m4a4,m4a1,ak-47,glock-18'
  }, function(data) {
    document.getElementById('items').value = data.items;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
