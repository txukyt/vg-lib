// src/core/config.js

const _defaultConfig = {
    urlMain: __URL_MAIN__,
    urlIntra: __URL_INTRA__,
    urlWeb: __URL_WEB__,
    urlExtranet: __URL_EXTRANET__,
    urlVpn: __URL_VPN__
};

let _currentConfig = { ..._defaultConfig };

export function configure(options) {
  if (!options || typeof options !== 'object') {
    return;
  }
  _currentConfig = { ..._currentConfig, ...options };
}

export function getConfig() {
  return _currentConfig;
}