(function () {
  'use strict';

  var s = document.createElement('script');

  s.dataset.appId = chrome.runtime.id;

  if (window.location.pathname === '/market/search') {
    s.src = chrome.extension.getURL('market.js');
  } else if (window.location.pathname.match(/\/market\/?$/)) {
    s.src = chrome.extension.getURL('home.js');
  }

  (document.head || document.documentElement).appendChild(s);

})();
