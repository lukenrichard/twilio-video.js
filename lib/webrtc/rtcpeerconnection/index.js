'use strict';

if (typeof RTCPeerConnection === 'function') {
  var guessBrowser = require('../util').guessBrowser;
  switch (guessBrowser()) {
    case 'chrome':
      module.exports = require('./chrome');
      break;
    case 'firefox':
      module.exports = require('./firefox');
      break;
    case 'safari':
      module.exports = require('./safari');
      break;
    default:
      // banana changes
      console.log('banana chrome is selected');
      module.exports = require('./chrome');
      break;
  }
} else {
  module.exports = function RTCPeerConnection() {
    throw new Error('RTCPeerConnection is not supported');
  };
}
