var weapons;

function get (cb) {
  chrome.storage.sync.get({
    weapons: 'knife,karambit,bayonet,awp,m4a4,m4a1,ak-47,glock-18'
  }, function(data) {
    cb(data.weapons);
  });
}


chrome.runtime.onMessageExternal.addListener( function(request, sender, sendResponse) {
  if (request.action === 'getstorage') {
   get(sendResponse);
   return true;
  }
});

