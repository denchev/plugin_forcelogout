'use strict'

var server = require('server');
var base = module.superModule;
server.extend(base);

server.append('Login', function (req, res, next) {
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
            session.custom.passwordChanged = true;
            Transaction.wrap(function () {
                var loginIds = customer.profile.custom.loginId;

                if(loginIds === null) {
                    loginIds = [];
                } else {
                    loginIds = JSON.parse(loginIds);
                }

                loginIds.push({
                    loginId: loginId
                });
                
                customer.profile.custom.loginId = JSON.stringify(loginIds);
            });
        }
    }
    next();
});

server.append('SavePassword', function (req, res, next) {
    var Site = require('dw/system/Site');
    var currentSite = Site.getCurrent();

    if (currentSite.getCustomPreferenceValue('enableForceLogout')) {
        this.on('route:BeforeComplete', function (req, res) {
            if (res.viewData.success) {
                var Transaction = require('dw/system/Transaction');
                Transaction.wrap(function () {
                    customer.profile.custom.loginId = JSON.stringify([{
                        loginId: session.custom.loginId
                    }]);
                });
            }
        });
    }
    
    next();
});

module.exports = server.exports();