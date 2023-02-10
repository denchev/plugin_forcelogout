'use strict';

var assert = require('chai').assert;
var sinon = require('sinon');
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

var CustomerMgr = {
    logoutCustomer: function () {
    }
}

var userLoggedInMiddleware = proxyquire('../../../../../cartridges/plugin_forcelogout/cartridge/scripts/middleware/userLoggedIn', {
    'dw/web/URLUtils': {
        url: function () {
            return 'some url';
        }
    },
    'dw/customer/CustomerMgr': CustomerMgr,
    'dw/system/Site': {
        getCurrent: function() {
            return {
                getCustomPreferenceValue() {
                    return true;
                }
            }
        }
    }
});

global.session = {
    custom: {
        loginId: 456
    }
}

describe('userLoggedInMiddleware', function() {
    const sandbox = sinon.createSandbox();

    beforeEach(function () {
        sandbox.spy(CustomerMgr);
    });

    afterEach(function () {
        sandbox.restore();
    });
    
    it('should logout customer if his loginId is not in customer loginId list', function () {
        var req = {
            currentCustomer: {
                raw: {
                    profile: {
                        custom: {
                            loginId: '[{"loginId": 123}]'
                        }
                    }
                }
            }
        };

        userLoggedInMiddleware.logoutMultipleSessions(req);
        assert.isTrue(CustomerMgr.logoutCustomer.called);
    });

    it('should handle invalid JSON', function () {
        var req = {
            currentCustomer: {
                raw: {
                    profile: {
                        custom: {
                            loginId: '[{loginId: 123}]' // invalid JSON on purpose
                        }
                    }
                }
            }
        };

        userLoggedInMiddleware.logoutMultipleSessions(req);
        assert.isTrue(CustomerMgr.logoutCustomer.called);
    });
});