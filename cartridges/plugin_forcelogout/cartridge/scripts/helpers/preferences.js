'use strict';

function getForceLogoutMode() {
    const Site = require('dw/system/Site');
    const forceLogoutMode = parseInt(Site.getCurrent().getCustomPreferenceValue('forceLogoutMode'), 10);

    return forceLogoutMode;
}

function getMaxRandomInt() {
    return 999999;
}

module.exports.getForceLogoutMode = getForceLogoutMode;
module.exports.getMaxRandomInt = getMaxRandomInt;