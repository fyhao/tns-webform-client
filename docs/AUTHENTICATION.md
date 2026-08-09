# OAuth/AD Authentication Module

## Overview
This module provides OAuth 2.0 and Active Directory authentication support for the NativeScript Webform Client application.

## Features
- OAuth 2.0 authentication flow
- Support for Microsoft Entra ID (Azure AD) and Google OpenID Connect
- Secure token storage using NativeScript Secure Storage
- User session management
- Login/Logout functionality

## Installation

The following dependencies are required:
```json
{
  "nativescript-oauth2": "^2.4.4",
  "nativescript-secure-storage": "^2.6.1"
}
```

Version 2.4.x is used because this application targets NativeScript 6.5. NativeScript OAuth2 3.x requires NativeScript 7 or newer. These dependencies are included in both application manifests.

## Usage

### Initialization

The authentication module is initialized by `homeView-view-model.js` from NativeScript application settings:

```javascript
var authModule = require('../../lib/modAuth/modAuth');

authModule.init({
    provider: appSettings.getString('oauth.provider', 'microsoft'),
    clientId: appSettings.getString('oauth.clientId', ''),
    redirectUri: appSettings.getString('oauth.redirectUri', ''),
    urlScheme: appSettings.getString('oauth.urlScheme', ''),
    scopes: appSettings.getString('oauth.scopes', 'openid profile email offline_access').split(/\s+/)
});
```

### Configuration

To configure the authentication for your specific OAuth provider:

1. Register your application with the OAuth provider (Microsoft Azure AD, Google Cloud Console, etc.)
2. Obtain your Client ID and configure redirect URIs
3. Provision these application-setting keys during deployment: `oauth.provider`, `oauth.clientId`, `oauth.redirectUri`, `oauth.urlScheme`, and `oauth.scopes`.
4. Register the same custom URL scheme in `App_Resources/iOS/Info.plist` and the Android manifest.

```javascript
appSettings.setString('oauth.provider', 'microsoft');
appSettings.setString('oauth.clientId', 'YOUR_PUBLIC_CLIENT_ID');
appSettings.setString('oauth.redirectUri', 'msalYOUR_CLIENT_ID:/auth');
appSettings.setString('oauth.urlScheme', 'msalYOUR_CLIENT_ID');
appSettings.setString('oauth.scopes', 'openid profile email offline_access');
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

## Implementation Note

Login uses the provider's real authorization-code flow with PKCE. The token result is stored with NativeScript Secure Storage, expired sessions are discarded, refresh tokens can be used through `refreshAccessToken()`, and logout clears local credentials even when provider sign-out fails.

## Supported Providers

The module is designed to work with:
- Microsoft Azure AD
- Google OAuth

## Future Enhancements

- Biometric authentication support
- Multi-factor authentication
- Remember me functionality
- Social login integration
