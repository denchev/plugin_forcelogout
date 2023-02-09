'use strict'

var server = require('server');
var base = module.superModule;
server.extend(base);

server.prepend('Logout', function (req, res, next) {
    // Clean session and log history
    const profile = req.currentCustomer.raw.profile;
    if(profile) {
        const activeLoginSessions = profile.custom.loginId == null ? [] : JSON.parse(profile.custom.loginId);
        let remainingActiveSessions = [];
        activeLoginSessions.forEach(function (activeSessionId) {
            if (activeSessionId.loginId !== session.custom.loginId) {
                remainingActiveSessions.push(activeSessionId);
            }
        });
        
        var Transaction = require('dw/system/Transaction');
        
        Transaction.wrap(function () {
            customer.profile.custom.loginId = JSON.stringify(remainingActiveSessions);
        });

    }
    next();
});

module.exports = server.exports();