# OAuth/AD Authentication Module

## Overview
This module provides OAuth 2.0 and Active Directory authentication support for the NativeScript Webform Client application.

## Features
- OAuth 2.0 authentication flow
- Support for multiple providers (Microsoft AD, Google, Facebook, etc.)
- Secure token storage using NativeScript Secure Storage
- User session management
- Login/Logout functionality

## Installation

The following dependencies are required:
```json
{
  "nativescript-oauth2": "^3.0.2",
  "nativescript-secure-storage": "^2.6.1"
}
```

These have been added to `abd-webform-client/package.json`.

## Usage

### Initialization

The authentication module is automatically initialized in the homeView-view-model.js:

```javascript
var authModule = require('../../lib/modAuth/modAuth');

authModule.init({
    provider: 'microsoft',      // OAuth provider
    clientId: 'your-client-id', // Your OAuth client ID
    redirectUri: 'your-app://callback',
    scopes: ['openid', 'profile', 'email']
});
```

### Configuration

To configure the authentication for your specific OAuth provider:

1. Register your application with the OAuth provider (Microsoft Azure AD, Google Cloud Console, etc.)
2. Obtain your Client ID and configure redirect URIs
3. Update the configuration in `abd-webform-client/app/components/homeView/homeView-view-model.js`:

```javascript
authModule.init({
    provider: 'microsoft',      // Change to your provider
    clientId: 'YOUR_CLIENT_ID', // Replace with your actual client ID
    redirectUri: 'your-app://callback', // Your app's callback URI
    scopes: ['openid', 'profile', 'email'] // Required scopes
});
```

### API Methods

#### `init(config)`
Initializes the authentication module with OAuth configuration.

**Parameters:**
- `config.provider` - OAuth provider name (e.g., 'microsoft', 'google')
- `config.clientId` - OAuth client ID
- `config.redirectUri` - Redirect URI for OAuth callback
- `config.scopes` - Array of OAuth scopes

#### `login()`
Initiates the OAuth login flow.

**Returns:** Promise that resolves with user information.

#### `logout()`
Logs out the current user and clears stored tokens.

**Returns:** Promise that resolves when logout is complete.

#### `isAuthenticated()`
Checks if user is currently authenticated.

**Returns:** Boolean

#### `getCurrentUser()`
Gets the current user's information.

**Returns:** User object or null

#### `getAccessToken()`
Gets the current access token.

**Returns:** String token or null

## UI Implementation

The home view has been updated with:
- Authentication status display
- User information display (name, email)
- Sign In button (shown when not authenticated)
- Sign Out button (shown when authenticated)

## Security

- Access tokens and refresh tokens are stored securely using `nativescript-secure-storage`
- The module uses OAuth 2.0 Authorization Code Flow
- Tokens are automatically cleared on logout
- No sensitive information is logged to console in production

## Testing

Tests for the authentication module can be found in `test/testModAuth.js`.

Run tests with:
```bash
npm test
```

## Current Implementation Note

The current implementation includes a mock OAuth flow for demonstration and testing purposes. In a production environment, you would:

1. Integrate with the actual `nativescript-oauth2` plugin for real OAuth flows
2. Configure provider-specific settings (authority URLs, token endpoints, etc.)
3. Implement token refresh logic
4. Add proper error handling for network failures

## Supported Providers

The module is designed to work with:
- Microsoft Azure AD
- Google OAuth
- Facebook OAuth
- Any OAuth 2.0 compliant provider

## Future Enhancements

- Token refresh mechanism
- Biometric authentication support
- Multi-factor authentication
- Remember me functionality
- Social login integration
