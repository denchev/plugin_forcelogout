'use strict';

var base = module.superModule;

var CustomerMgr = require('dw/customer/CustomerMgr');

function logoutMultipleSessions(req) {
    var Site = require('dw/system/Site');
    var currentSite = Site.getCurrent();

    if (currentSite.getCustomPreferenceValue('enableForceLogout')) {
        const profile = req.currentCustomer.raw.profile;

        if(profile) {
            let activeLoginSessions;
            try {
                activeLoginSessions = JSON.parse(profile.custom.loginId);
            } catch (e) {
                activeLoginSessions = [];
            }
            let isSessionAlive = false;
            activeLoginSessions.forEach(function (activeSessionId) {
                if (activeSessionId.loginId === session.custom.loginId) {
                    isSessionAlive = true;
                }
            });

            if (isSessionAlive === false) {
                CustomerMgr.logoutCustomer(true);
            }
        }
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