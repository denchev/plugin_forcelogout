'use strict'

var server = require('server');
var base = module.superModule;
server.extend(base);

server.append('SaveNewPassword', function (req, res, next) {
    try {
        // Proceed if login is successful
        if (res.viewData.success) {
            var Site = require('dw/system/Site');
            var currentSite = Site.getCurrent();

            if (currentSite.getCustomPreferenceValue('enableForceLogout')) {
                var SecureRandom = require('dw/crypto/SecureRandom');
                var random = new SecureRandom();
                var loginId = random.nextInt(999999);
                var Transaction = require('dw/system/Transaction');
                
                session.custom.loginId = loginId;
                Transaction.wrap(function () {
                    customer.profile.custom.activeLogins = JSON.stringify([loginId]);
                });
            }
        }
    } catch (e) {
        var Logger = require('dw/system/Logger');
        Logger.error('The following error occured in plugin_forcelogout: ' + e.message);
    }
    next();
});

server.append('Login', function (req, res, next) {
    try {
        // Proceed if login is successful
        if (res.viewData.success) {
            var Site = require('dw/system/Site');
            var currentSite = Site.getCurrent();

            if (currentSite.getCustomPreferenceValue('enableForceLogoutPostLogin')
            || currentSite.getCustomPreferenceValue('enableForceLogoutPostPasswordChange')) {
                var SecureRandom = require('dw/crypto/SecureRandom');
                var random = new SecureRandom();
                var loginId = random.nextInt(999999);
                var Transaction = require('dw/system/Transaction');
                
                session.custom.loginId = loginId;
                Transaction.wrap(function () {
                    var activeLogins = customer.profile.custom.activeLogins === null ? [] : JSON.parse(customer.profile.custom.activeLogins);
                    if (currentSite.getCustomPreferenceValue('enableForceLogoutPostLogin')) {
                        activeLogins = [loginId];
                    } else if (currentSite.getCustomPreferenceValue('enableForceLogoutPostPasswordChange')) {
                        activeLogins.push(loginId);
                    }
                    customer.profile.custom.activeLogins = JSON.stringify(activeLogins);
                });
            }
        }
    } catch(e) {
        var Logger = require('dw/system/Logger');
        Logger.error('The following error occured in plugin_forcelogout: ' + e.message);
    }
    next();
});

server.append('SavePassword', function (req, res, next) {
    try {
        var Site = require('dw/system/Site');
        var currentSite = Site.getCurrent();

        if (currentSite.getCustomPreferenceValue('enableForceLogoutPostPasswordChange')) {
            this.on('route:BeforeComplete', function (req, res) {
                if (res.viewData.success) {
                    var Transaction = require('dw/system/Transaction');
                    Transaction.wrap(function () {
                        customer.profile.custom.activeLogins = JSON.stringify([session.custom.loginId]);
                    });
                }
            });
        }
    } catch (e) {
        var Logger = require('dw/system/Logger');
        Logger.error('The following error occured in plugin_forcelogout: ' + e.message);
    }
    
    next();
});

module.exports = server.exports();