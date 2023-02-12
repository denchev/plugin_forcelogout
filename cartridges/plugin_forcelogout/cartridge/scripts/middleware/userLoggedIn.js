'use strict';

var base = module.superModule;

function logoutMultipleSessions(req) {
    try {
        if (require('~/cartridge/scripts/helpers/preferences').getForceLogoutMode()) {
            const profile = req.currentCustomer.raw.profile;

            if(profile) {
                var activeLogins = JSON.parse(profile.custom.activeLogins);
                var keepLogin = false;
                activeLogins.forEach(function (activeLogin) {
                    if (activeLogin === session.custom.loginId) {
                        keepLogin = true;
                    }
                });

                if (keepLogin === false) {
                    var CustomerMgr = require('dw/customer/CustomerMgr');
                    CustomerMgr.logoutCustomer(true);
                }
            }
        }
    } catch (e) {
        var Logger = require('dw/system/Logger');
        Logger.error('The following error occured in plugin_forcelogout: ' + e.message);
    }
}

/**
 * Middleware validating if user logged in
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next call in the middleware chain
 * @returns {void}
 */
function validateLoggedIn(req, res, next) {

    logoutMultipleSessions(req);

    base.validateLoggedIn(req, res, next);
}

/**
 * Middleware validating if user logged in from ajax request
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next call in the middleware chain
 * @returns {void}
 */
function validateLoggedInAjax(req, res, next) {
    logoutMultipleSessions(req);

    base.validateLoggedInAjax(req, res, next);
}

module.exports = {
    validateLoggedIn: validateLoggedIn,
    validateLoggedInAjax: validateLoggedInAjax,
    logoutMultipleSessions: logoutMultipleSessions
};