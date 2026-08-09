'use strict';

var TOKEN_KEY = 'oauth_token_result';
var USER_KEY = 'oauth_user_info';
var authInstance = null;
var currentUser = null;
var accessToken = null;
var readyPromise = Promise.resolve();

function errorMessage(error) {
    return error && (error.message || error.toString()) || 'OAuth operation failed';
}

function validateConfig(config) {
    if (!config || !config.clientId || config.clientId === 'your-client-id') {
        throw new Error('A valid OAuth clientId is required');
    }
    if (!config.redirectUri || config.redirectUri.indexOf(':') < 1) {
        throw new Error('A valid OAuth redirectUri is required');
    }
    if (['microsoft', 'google'].indexOf(config.provider) < 0) {
        throw new Error('Supported OAuth providers are microsoft and google');
    }
}

function getUrlScheme(config) {
    return config.urlScheme || config.redirectUri.split(':')[0];
}

function createProvider(config, providers) {
    var options = {
        openIdSupport: 'oid-full',
        clientId: config.clientId,
        redirectUri: config.redirectUri,
        urlScheme: getUrlScheme(config),
        scopes: config.scopes || ['openid', 'profile', 'email', 'offline_access']
    };

    if (config.customQueryParams) {
        options.customQueryParams = config.customQueryParams;
    }

    if (config.provider === 'microsoft') {
        return new providers.TnsOaProviderMicrosoft(options);
    }
    return new providers.TnsOaProviderGoogle(options);
}

function decodeClaims(idToken) {
    if (!idToken || idToken.split('.').length < 2) {
        return {};
    }

    try {
        var encoded = idToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        while (encoded.length % 4) {
            encoded += '=';
        }
        var json;
        if (typeof atob === 'function') {
            json = decodeURIComponent(Array.prototype.map.call(atob(encoded), function(character) {
                return '%' + ('00' + character.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        } else if (typeof Buffer !== 'undefined') {
            json = Buffer.from(encoded, 'base64').toString('utf8');
        } else {
            return {};
        }
        return JSON.parse(json);
    } catch (error) {
        return {};
    }
}

function userFromToken(tokenResult, provider) {
    var claims = decodeClaims(tokenResult.idToken);
    return {
        id: claims.sub || claims.oid || '',
        name: claims.name || claims.preferred_username || '',
        email: claims.email || claims.preferred_username || '',
        provider: provider
    };
}

function tokenHasExpired(tokenResult) {
    if (!tokenResult || !tokenResult.accessToken) {
        return true;
    }
    if (!tokenResult.accessTokenExpiration) {
        return false;
    }
    return new Date(tokenResult.accessTokenExpiration).getTime() <= Date.now();
}

function clearLocalSession() {
    accessToken = null;
    currentUser = null;
    if (authInstance && authInstance.client) {
        authInstance.client.tokenResult = null;
    }
    if (!authInstance || !authInstance.storage) {
        return Promise.resolve();
    }
    return Promise.all([
        authInstance.storage.remove({ key: TOKEN_KEY }),
        authInstance.storage.remove({ key: USER_KEY })
    ]).then(function() {});
}

function restoreSession() {
    return Promise.all([
        authInstance.storage.get({ key: TOKEN_KEY }),
        authInstance.storage.get({ key: USER_KEY })
    ]).then(function(values) {
        if (!values[0]) {
            return;
        }
        var tokenResult = JSON.parse(values[0]);
        if (tokenHasExpired(tokenResult)) {
            return clearLocalSession();
        }
        authInstance.client.tokenResult = tokenResult;
        accessToken = tokenResult.accessToken;
        currentUser = values[1] ? JSON.parse(values[1]) : userFromToken(tokenResult, authInstance.config.provider);
    }).catch(function() {
        return clearLocalSession();
    });
}

function init(config) {
    try {
        validateConfig(config);
        var oauth = require('nativescript-oauth2');
        var providers = require('nativescript-oauth2/providers');
        var SecureStorage = require('nativescript-secure-storage').SecureStorage;
        var provider = createProvider(config, providers);
        oauth.configureTnsOAuth([provider]);
        authInstance = {
            config: config,
            client: new oauth.TnsOAuthClient(config.provider, config.pkce !== false),
            storage: new SecureStorage()
        };
        readyPromise = restoreSession();
        return true;
    } catch (error) {
        authInstance = null;
        console.error('Unable to initialize OAuth: ' + errorMessage(error));
        return false;
    }
}

function ready() {
    return readyPromise;
}

function saveSession(tokenResult) {
    if (!tokenResult || !tokenResult.accessToken) {
        return Promise.reject(new Error('OAuth provider returned no access token'));
    }
    var user = userFromToken(tokenResult, authInstance.config.provider);
    return Promise.all([
        authInstance.storage.set({ key: TOKEN_KEY, value: JSON.stringify(tokenResult) }),
        authInstance.storage.set({ key: USER_KEY, value: JSON.stringify(user) })
    ]).then(function() {
        authInstance.client.tokenResult = tokenResult;
        accessToken = tokenResult.accessToken;
        currentUser = user;
        return user;
    });
}

function login() {
    if (!authInstance) {
        return Promise.reject(new Error('Auth module not initialized. Call init() with a valid OAuth configuration first.'));
    }
    return ready().then(function() {
        return new Promise(function(resolve, reject) {
            authInstance.client.loginWithCompletion(function(tokenResult, error) {
                if (error) {
                    reject(new Error(errorMessage(error)));
                    return;
                }
                saveSession(tokenResult).then(resolve, reject);
            });
        });
    });
}

function refreshAccessToken() {
    if (!authInstance || !authInstance.client.tokenResult) {
        return Promise.reject(new Error('No authenticated session to refresh'));
    }
    return new Promise(function(resolve, reject) {
        authInstance.client.refreshTokenWithCompletion(function(tokenResult, error) {
            if (error) {
                reject(new Error(errorMessage(error)));
                return;
            }
            saveSession(tokenResult).then(function() {
                resolve(accessToken);
            }, reject);
        });
    });
}

function logout() {
    if (!authInstance) {
        return Promise.reject(new Error('Auth module not initialized'));
    }
    return new Promise(function(resolve) {
        authInstance.client.logoutWithCompletion(function(data, response, error) {
            resolve(error);
        });
    }).then(function(remoteError) {
        return clearLocalSession().then(function() {
            if (remoteError) {
                throw new Error(errorMessage(remoteError));
            }
        });
    });
}

function isAuthenticated() {
    return !!accessToken;
}

module.exports = {
    init: init,
    ready: ready,
    login: login,
    logout: logout,
    refreshAccessToken: refreshAccessToken,
    isAuthenticated: isAuthenticated,
    getCurrentUser: function() { return currentUser; },
    getAccessToken: function() { return accessToken; }
};
