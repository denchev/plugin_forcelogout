'use strict'

var server = require('server');
var base = module.superModule;
server.extend(base);

server.prepend('Logout', function (req, res, next) {
    // Clean session and log history
    next();
});

module.exports = server.exports();