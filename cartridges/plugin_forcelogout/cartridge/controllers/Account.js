'use strict'

var server = require('server');
var base = module.superModule;
server.extend(base);

server.append('Login', function (req, res, next) {
    try {
        // Proceed if login is successful
        if (res.viewData.success) {
            const logoutMode = require('~/cartridge/scripts/helpers/preferences').getForceLogoutMode();

            if (logoutMode) {
                var SecureRandom = require('dw/crypto/SecureRandom');
                var random = new SecureRandom();
                var loginId = random.nextInt(require('~/cartridge/scripts/helpers/preferences').getMaxRandomInt());
                var Transaction = require('dw/system/Transaction');
                
                session.custom.loginId = loginId;
                Transaction.wrap(function () {
                    var cust = customer;
                    var activeLogins = customer.profile.custom.activeLogins === null ? [] : JSON.parse(customer.profile.custom.activeLogins);
                    if (logoutMode === require('~/cartridge/config/constants').FORCE_LOGOUT_MODES.ONE_LOGIN) {
                        activeLogins = [loginId];
                    } else if (logoutMode === require('~/cartridge/config/constants').FORCE_LOGOUT_MODES.PASSWORD_CHANGE) {
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
        if (require('~/cartridge/scripts/helpers/preferences').getForceLogoutMode() === require('~/cartridge/config/constants').FORCE_LOGOUT_MODES.PASSWORD_CHANGE) {
            this.on('route:BeforeComplete', function (req, res) {
                if (res.viewData.success && session.custom.loginId) {
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