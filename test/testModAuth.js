var should = require('should');
var mockRequire = require('mock-require');

describe('modAuth', function() {
    var modAuth;
    var mockSecureStorage;
    
    beforeEach(function() {
        // Mock SecureStorage
        mockSecureStorage = {
            storage: {},
            get: function(options) {
                return Promise.resolve(this.storage[options.key]);
            },
            set: function(options) {
                this.storage[options.key] = options.value;
                return Promise.resolve();
            },
            remove: function(options) {
                delete this.storage[options.key];
                return Promise.resolve();
            }
        };
        
        // Mock the nativescript-secure-storage module
        mockRequire('nativescript-secure-storage', {
            SecureStorage: function() {
                return mockSecureStorage;
            }
        });
        
        // Clear cache and require fresh module
        delete require.cache[require.resolve('../app/lib/modAuth/modAuth.js')];
        modAuth = require('../app/lib/modAuth/modAuth.js');
    });
    
    afterEach(function() {
        mockRequire.stopAll();
    });
    
    describe('#init', function() {
        it('should initialize with OAuth config', function() {
            var config = {
                provider: 'microsoft',
                clientId: 'test-client-id',
                redirectUri: 'test://callback',
                scopes: ['openid', 'profile']
            };
            
            var result = modAuth.init(config);
            result.should.be.true();
        });
    });
    
    describe('#login', function() {
        it('should fail if not initialized', function(done) {
            modAuth.login()
                .then(function() {
                    done(new Error('Should have failed'));
                })
                .catch(function(error) {
                    error.message.should.containEql('not initialized');
                    done();
                });
        });
        
        it('should successfully login after initialization', function(done) {
            var config = {
                provider: 'microsoft',
                clientId: 'test-client-id',
                redirectUri: 'test://callback',
                scopes: ['openid', 'profile']
            };
            
            modAuth.init(config);
            
            modAuth.login()
                .then(function(user) {
                    user.should.be.an.Object();
                    user.should.have.property('id');
                    user.should.have.property('name');
                    user.should.have.property('email');
                    user.provider.should.equal('microsoft');
                    done();
                })
                .catch(done);
        });
        
        it('should set authenticated state after login', function(done) {
            var config = {
                provider: 'google',
                clientId: 'test-client-id',
                redirectUri: 'test://callback',
                scopes: ['openid', 'profile']
            };
            
            modAuth.init(config);
            
            modAuth.login()
                .then(function() {
                    modAuth.isAuthenticated().should.be.true();
                    done();
                })
                .catch(done);
        });
    });
    
    describe('#logout', function() {
        it('should fail if not initialized', function(done) {
            // Create new instance without initialization
            delete require.cache[require.resolve('../app/lib/modAuth/modAuth.js')];
            var freshModAuth = require('../app/lib/modAuth/modAuth.js');
            
            freshModAuth.logout()
                .then(function() {
                    done(new Error('Should have failed'));
                })
                .catch(function(error) {
                    error.message.should.containEql('not initialized');
                    done();
                });
        });
        
        it('should successfully logout after login', function(done) {
            var config = {
                provider: 'microsoft',
                clientId: 'test-client-id',
                redirectUri: 'test://callback',
                scopes: ['openid', 'profile']
            };
            
            modAuth.init(config);
            
            modAuth.login()
                .then(function() {
                    return modAuth.logout();
                })
                .then(function() {
                    modAuth.isAuthenticated().should.be.false();
                    should.not.exist(modAuth.getCurrentUser());
                    should.not.exist(modAuth.getAccessToken());
                    done();
                })
                .catch(done);
        });
    });
    
    describe('#isAuthenticated', function() {
        it('should return false initially', function() {
            var config = {
                provider: 'microsoft',
                clientId: 'test-client-id',
                redirectUri: 'test://callback',
                scopes: ['openid', 'profile']
            };
            
            modAuth.init(config);
            modAuth.isAuthenticated().should.be.false();
        });
    });
    
    describe('#getCurrentUser', function() {
        it('should return null when not authenticated', function() {
            var config = {
                provider: 'microsoft',
                clientId: 'test-client-id',
                redirectUri: 'test://callback',
                scopes: ['openid', 'profile']
            };
            
            modAuth.init(config);
            should.not.exist(modAuth.getCurrentUser());
        });
        
        it('should return user object when authenticated', function(done) {
            var config = {
                provider: 'microsoft',
                clientId: 'test-client-id',
                redirectUri: 'test://callback',
                scopes: ['openid', 'profile']
            };
            
            modAuth.init(config);
            
            modAuth.login()
                .then(function() {
                    var user = modAuth.getCurrentUser();
                    user.should.be.an.Object();
                    user.should.have.property('id');
                    user.should.have.property('name');
                    user.should.have.property('email');
                    done();
                })
                .catch(done);
        });
    });
    
    describe('#getAccessToken', function() {
        it('should return null when not authenticated', function() {
            var config = {
                provider: 'microsoft',
                clientId: 'test-client-id',
                redirectUri: 'test://callback',
                scopes: ['openid', 'profile']
            };
            
            modAuth.init(config);
            should.not.exist(modAuth.getAccessToken());
        });
        
        it('should return token when authenticated', function(done) {
            var config = {
                provider: 'microsoft',
                clientId: 'test-client-id',
                redirectUri: 'test://callback',
                scopes: ['openid', 'profile']
            };
            
            modAuth.init(config);
            
            modAuth.login()
                .then(function() {
                    var token = modAuth.getAccessToken();
                    should.exist(token);
                    token.should.be.a.String();
                    token.should.containEql('mock_access_token_');
                    done();
                })
                .catch(done);
        });
    });
});
