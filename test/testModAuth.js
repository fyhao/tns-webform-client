var should = require('should');
var mockRequire = require('mock-require');

describe('modAuth', function() {
    var modAuth;
    var storage;
    var clients;
    var configuredProviders;

    function idToken(claims) {
        return 'header.' + Buffer.from(JSON.stringify(claims)).toString('base64url') + '.signature';
    }

    function token(value) {
        return {
            accessToken: value || 'real-provider-token',
            refreshToken: 'refresh-token',
            idToken: idToken({ sub: 'user-123', name: 'Yong Hao', email: 'user@example.com' }),
            accessTokenExpiration: new Date(Date.now() + 60000).toISOString()
        };
    }

    function validConfig() {
        return {
            provider: 'microsoft',
            clientId: 'client-id',
            redirectUri: 'msalclient:/auth',
            scopes: ['openid', 'profile', 'email', 'offline_access']
        };
    }

    beforeEach(function() {
        storage = {};
        clients = [];
        configuredProviders = [];

        function MockClient(provider, pkce) {
            this.provider = provider;
            this.pkce = pkce;
            this.tokenResult = null;
            this.loginWithCompletion = function(callback) { callback(token(), null); };
            this.refreshTokenWithCompletion = function(callback) { callback(token('refreshed-token'), null); };
            this.logoutWithCompletion = function(callback) { callback(null, null, null); };
            clients.push(this);
        }

        function MicrosoftProvider(options) { this.options = options; this.providerType = 'microsoft'; }
        function GoogleProvider(options) { this.options = options; this.providerType = 'google'; }

        mockRequire('nativescript-oauth2', {
            TnsOAuthClient: MockClient,
            configureTnsOAuth: function(providers) { configuredProviders = providers; }
        });
        mockRequire('nativescript-oauth2/providers', {
            TnsOaProviderMicrosoft: MicrosoftProvider,
            TnsOaProviderGoogle: GoogleProvider
        });
        mockRequire('nativescript-secure-storage', {
            SecureStorage: function() {
                return {
                    get: function(options) { return Promise.resolve(storage[options.key]); },
                    set: function(options) { storage[options.key] = options.value; return Promise.resolve(); },
                    remove: function(options) { delete storage[options.key]; return Promise.resolve(); }
                };
            }
        });

        delete require.cache[require.resolve('../app/lib/modAuth/modAuth.js')];
        modAuth = require('../app/lib/modAuth/modAuth.js');
    });

    afterEach(function() {
        mockRequire.stopAll();
    });

    it('rejects placeholder configuration', function() {
        modAuth.init({ provider: 'microsoft', clientId: 'your-client-id', redirectUri: 'app:/auth' }).should.be.false();
    });

    it('configures Microsoft OAuth with PKCE and the custom URL scheme', function() {
        modAuth.init(validConfig()).should.be.true();
        configuredProviders.should.have.length(1);
        configuredProviders[0].options.urlScheme.should.equal('msalclient');
        clients[0].pkce.should.be.true();
    });

    it('uses the provider token and stores it securely', function() {
        modAuth.init(validConfig());
        return modAuth.login().then(function(user) {
            user.name.should.equal('Yong Hao');
            user.email.should.equal('user@example.com');
            modAuth.getAccessToken().should.equal('real-provider-token');
            storage.should.have.property('oauth_token_result');
            storage.should.have.property('oauth_user_info');
        });
    });

    it('restores an unexpired session', function() {
        storage.oauth_token_result = JSON.stringify(token('stored-token'));
        storage.oauth_user_info = JSON.stringify({ id: 'user-123', name: 'Stored User', email: 'stored@example.com' });
        modAuth.init(validConfig());
        return modAuth.ready().then(function() {
            modAuth.isAuthenticated().should.be.true();
            modAuth.getAccessToken().should.equal('stored-token');
            clients[0].tokenResult.accessToken.should.equal('stored-token');
        });
    });

    it('clears an expired stored session', function() {
        var expired = token('expired-token');
        expired.accessTokenExpiration = new Date(Date.now() - 60000).toISOString();
        storage.oauth_token_result = JSON.stringify(expired);
        modAuth.init(validConfig());
        return modAuth.ready().then(function() {
            modAuth.isAuthenticated().should.be.false();
            should.not.exist(storage.oauth_token_result);
        });
    });

    it('refreshes and persists the access token', function() {
        modAuth.init(validConfig());
        return modAuth.login().then(function() {
            return modAuth.refreshAccessToken();
        }).then(function(accessToken) {
            accessToken.should.equal('refreshed-token');
            JSON.parse(storage.oauth_token_result).accessToken.should.equal('refreshed-token');
        });
    });

    it('clears local credentials on logout', function() {
        modAuth.init(validConfig());
        return modAuth.login().then(function() {
            return modAuth.logout();
        }).then(function() {
            modAuth.isAuthenticated().should.be.false();
            should.not.exist(modAuth.getCurrentUser());
            should.not.exist(storage.oauth_token_result);
        });
    });

    it('rejects login before initialization', function() {
        return modAuth.login().then(function() {
            throw new Error('Expected login to fail');
        }, function(error) {
            error.message.should.containEql('not initialized');
        });
    });
});
