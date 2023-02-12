'use strict';

function getForceLogoutMode() {
    const constants = require('~/cartridge/config/constants');
    const Site = require('dw/system/Site');
    const forceLogoutMode = parseInt(Site.getCurrent().getCustomPreferenceValue(constants.PREFERENCES.FORCE_LOGOUT_MODE), 10);

    return forceLogoutMode;
}

function getMaxRandomInt() {
    return 999999;
}

module.exports.getForceLogoutMode = getForceLogoutMode;
module.exports.getMaxRandomInt = getMaxRandomInt;