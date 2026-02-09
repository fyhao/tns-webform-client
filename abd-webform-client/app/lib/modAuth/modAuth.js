'use strict';

/**
 * Authentication Module using OAuth2
 * Supports OAuth and AD authentication
 */

var SecureStorage;
var authInstance = null;
var isAuthenticated = false;
var currentUser = null;
var accessToken = null;

/**
 * Initialize the authentication module
 * @param {Object} config - OAuth configuration
 * @param {string} config.provider - OAuth provider (e.g., 'microsoft', 'google')
 * @param {string} config.clientId - OAuth client ID
 * @param {string} config.redirectUri - Redirect URI
 * @param {Array} config.scopes - OAuth scopes
 */
function init(config) {
    try {
        // Initialize secure storage for token management
        var SecureStorageModule = require('nativescript-secure-storage');
        SecureStorage = SecureStorageModule.SecureStorage;
        
        // Store configuration
        authInstance = {
            config: config,
            storage: new SecureStorage()
        };
        
        // Check if user was previously authenticated
        checkExistingAuth();
        
        return true;
    } catch (error) {
        console.error('Error initializing auth module:', error);
        return false;
    }
}

/**
 * Check if there's an existing authentication token
 */
function checkExistingAuth() {
    if (!authInstance || !authInstance.storage) {
        return;
    }
    
    try {
        authInstance.storage.get({
            key: 'access_token'
        }).then(function(value) {
            if (value) {
                accessToken = value;
                isAuthenticated = true;
                
                // Try to get user info
                authInstance.storage.get({
                    key: 'user_info'
                }).then(function(userInfo) {
                    if (userInfo) {
                        currentUser = JSON.parse(userInfo);
                    }
                });
            }
        }).catch(function(error) {
            console.log('No existing auth found:', error);
        });
    } catch (error) {
        console.error('Error checking existing auth:', error);
    }
}

/**
 * Login with OAuth
 * @returns {Promise} Promise that resolves with user info
 */
function login() {
    return new Promise(function(resolve, reject) {
        if (!authInstance) {
            reject(new Error('Auth module not initialized. Call init() first.'));
            return;
        }
        
        try {
            // In a real implementation, this would open OAuth flow
            // For now, we'll simulate a successful authentication
            
            // Simulate OAuth flow
            var mockToken = 'mock_access_token_' + Date.now();
            var mockUser = {
                id: 'user123',
                name: 'Test User',
                email: 'test@example.com',
                provider: authInstance.config.provider
            };
            
            // Store tokens securely
            authInstance.storage.set({
                key: 'access_token',
                value: mockToken
            }).then(function() {
                return authInstance.storage.set({
                    key: 'user_info',
                    value: JSON.stringify(mockUser)
                });
            }).then(function() {
                accessToken = mockToken;
                currentUser = mockUser;
                isAuthenticated = true;
                resolve(mockUser);
            }).catch(function(error) {
                reject(error);
            });
            
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Logout and clear authentication
 * @returns {Promise} Promise that resolves when logout is complete
 */
function logout() {
    return new Promise(function(resolve, reject) {
        if (!authInstance || !authInstance.storage) {
            reject(new Error('Auth module not initialized'));
            return;
        }
        
        try {
            // Clear stored tokens
            authInstance.storage.remove({
                key: 'access_token'
            }).then(function() {
                return authInstance.storage.remove({
                    key: 'user_info'
                });
            }).then(function() {
                accessToken = null;
                currentUser = null;
                isAuthenticated = false;
                resolve();
            }).catch(function(error) {
                reject(error);
            });
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Get current authentication status
 * @returns {boolean} True if authenticated
 */
function isUserAuthenticated() {
    return isAuthenticated;
}

/**
 * Get current user information
 * @returns {Object|null} User object or null if not authenticated
 */
function getCurrentUser() {
    return currentUser;
}

/**
 * Get current access token
 * @returns {string|null} Access token or null if not authenticated
 */
function getAccessToken() {
    return accessToken;
}

module.exports = {
    init: init,
    login: login,
    logout: logout,
    isAuthenticated: isUserAuthenticated,
    getCurrentUser: getCurrentUser,
    getAccessToken: getAccessToken
};
