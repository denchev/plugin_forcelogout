'use strict'

var server = require('server');
var base = module.superModule;
server.extend(base);

server.prepend('Logout', function (req, res, next) {
    // Clean session and log history
    try {
        const profile = req.currentCustomer.raw.profile;
        if(profile) {
            const activeLogins = profile.custom.activeLogins == null ? [] : JSON.parse(profile.custom.activeLogins);
            let remainingActiveLogins = [];
            activeLogins.forEach(function (activeLogin) {
                var loginId = session.custom.loginId;
                if (activeLogin !== session.custom.loginId) {
                    remainingActiveLogins.push(activeLogin);
                }
            });
            
            var Transaction = require('dw/system/Transaction');
            
            Transaction.wrap(function () {
                customer.profile.custom.activeLogins = JSON.stringify(remainingActiveLogins);
            });
        }
    } catch(e) {
        var Logger = require('dw/system/Logger');
        Logger.error('The following error occured in plugin_forcelogout: ' + e.message);
    }
    next();
});

module.exports = server.exports();