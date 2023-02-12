'use strict';

const MAX_RANDOM_INT=999999;

const FORCE_LOGOUT_MODES = {
    'DISABLED': 0,
    'ONE_LOGIN': 1,
    'PASSWORD_CHANGE': 2
};

const PREFERENCES = {
    'FORCE_LOGOUT_MODE': 'forceLogoutMode'
}

module.exports.MAX_RANDOM_INT=MAX_RANDOM_INT;
module.exports.FORCE_LOGOUT_MODES = FORCE_LOGOUT_MODES;
module.exports.PREFERENCES = PREFERENCES;