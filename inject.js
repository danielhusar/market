var s = document.createElement('script');

if (window.location.pathname === '/market/search') {
  s.src = chrome.extension.getURL('market.js');
} else if(window.location.pathname === '/market') {
  s.src = chrome.extension.getURL('home.js');
}

s.onload = function() {
  this.parentNode.removeChild(this);
};
(document.head || document.documentElement).appendChild(s);
