'use strict';

var base = module.superModule;

var CustomerMgr = require('dw/customer/CustomerMgr');

function logoutMultipleSessions(req) {
    try {
        var Site = require('dw/system/Site');
        var currentSite = Site.getCurrent();

        if (currentSite.getCustomPreferenceValue('enableForceLogout')) {
            const profile = req.currentCustomer.raw.profile;

            if(profile) {
                let activeLogins;
                try {
                    activeLogins = JSON.parse(profile.custom.activeLogins);
                } catch (e) {
                    activeLogins = [];
                }
                let keepLogin = false;
                activeLogins.forEach(function (activeLogin) {
                    if (activeLogin === session.custom.loginId) {
                        keepLogin = true;
                    }
                });

                if (keepLogin === false) {
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

module.exports = base||{}; // hack to allow execution in Node and SFCC
module.exports.logoutMultipleSessions = logoutMultipleSessions;