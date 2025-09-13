# SSO Implementation Documentation

## Executive Summary

This document provides a comprehensive overview of the Single Sign-On (SSO) implementation for the M&S EchoEngine chatbot application. The implementation transforms a publicly accessible SvelteKit application into a secure, tenant-restricted internal tool using Microsoft Entra ID (formerly Azure Active Directory) authentication through Azure Static Web Apps.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Implementation Goals](#implementation-goals)
3. [Architecture Overview](#architecture-overview)
4. [Implementation Timeline](#implementation-timeline)
5. [Code Changes Summary](#code-changes-summary)
6. [Issues Encountered and Solutions](#issues-encountered-and-solutions)
7. [Technical Deep Dive](#technical-deep-dive)
8. [Security Considerations](#security-considerations)
9. [Testing and Validation](#testing-and-validation)
10. [Lessons Learned](#lessons-learned)

## Project Overview

### Initial State
- **Application**: SvelteKit-based chatbot with M&S EchoEngine integration
- **Deployment**: Azure Static Web Apps
- **Access**: Publicly accessible without authentication
- **Framework**: SvelteKit with TypeScript/JavaScript
- **Styling**: TailwindCSS
- **Build Tool**: Vite

### Final State
- **Authentication**: Microsoft Entra ID SSO with tenant restriction
- **Access Control**: Edge-level authentication enforcement
- **User Experience**: Seamless authentication flow with automatic redirects
- **Security**: Tenant-isolated access with secure session management

## Implementation Goals

1. **Primary Objective**: Implement tenant-restricted SSO to secure the chatbot application
2. **Security Requirements**:
   - Only authenticated users from a specific Microsoft Entra ID tenant can access the application
   - No public access to any application routes
   - Secure handling of user sessions
3. **User Experience Requirements**:
   - Automatic redirect to Microsoft login for unauthenticated users
   - Display user information in the application header
   - Clean logout functionality
   - Loading states during authentication

## Architecture Overview

### Authentication Flow

```mermaid
graph TD
    A[User Accesses App] --> B{Authenticated?}
    B -->|No| C[Redirect to /.auth/login/aad]
    B -->|Yes| D[Load User Data]
    C --> E[Microsoft Entra ID Login]
    E --> F[Callback to App]
    F --> D
    D --> G[Display Chat Interface]
    G --> H[User Can Logout]
    H --> I[/.auth/logout]
    I --> A
```

### Component Architecture

```
┌─────────────────────────────────────────────┐
│            Azure Static Web Apps            │
│  ┌─────────────────────────────────────┐   │
│  │     Edge Authentication Layer       │   │
│  │   (staticwebapp.config.json)       │   │
│  └─────────────────────────────────────┘   │
│                    ↓                        │
│  ┌─────────────────────────────────────┐   │
│  │     SvelteKit Application          │   │
│  │  ┌──────────────────────────────┐  │   │
│  │  │  +layout.server.js           │  │   │
│  │  │  (Server-side auth check)    │  │   │
│  │  └──────────────────────────────┘  │   │
│  │            ↓                        │   │
│  │  ┌──────────────────────────────┐  │   │
│  │  │  +layout.svelte              │  │   │
│  │  │  (Client-side store update)  │  │   │
│  │  └──────────────────────────────┘  │   │
│  │            ↓                        │   │
│  │  ┌──────────────────────────────┐  │   │
│  │  │  User Store                  │  │   │
│  │  │  (Global auth state)         │  │   │
│  │  └──────────────────────────────┘  │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

## Implementation Timeline

### Phase 1: Initial SSO Implementation

1. **Created Authentication Configuration** (`staticwebapp.config.json`)
   - Defined authentication routes
   - Set up role-based access control
   - Configured automatic redirects for unauthenticated users

2. **Implemented State Management** (`src/lib/stores/userStore.js`)
   - Created reactive Svelte stores for user data
   - Added loading state management

3. **Server-Side Authentication** (`src/routes/+layout.server.js`)
   - Implemented server-side user data fetching
   - Added build-time checks to prevent prerender issues

4. **Client-Side Integration** (`src/routes/+layout.svelte`)
   - Connected server data to client stores
   - Added fallback client-side authentication checks

5. **UI Updates**
   - Modified Header component to display user info and logout
   - Protected main chat interface with authentication guards
   - Added loading and unauthenticated states

### Phase 2: Build Issues Resolution

1. **Route Ordering Fix**
   - Reordered routes to prevent wildcard conflicts
   - Placed specific auth routes before general wildcards

2. **Prerendering Fixes**
   - Disabled prerendering for all pages
   - Added `data-sveltekit-preload-data="off"` to auth links
   - Configured build-time checks

3. **Build Script Updates**
   - Modified build process to preserve custom configuration
   - Ensured proper config file placement

## Code Changes Summary

### New Files Created

1. **`staticwebapp.config.json`**
   ```json
   {
     "routes": [
       {
         "route": "/.auth/login/*",
         "allowedRoles": ["anonymous"]
       },
       {
         "route": "/.auth/logout",
         "allowedRoles": ["anonymous", "authenticated"]
       },
       {
         "route": "/.auth/me",
         "allowedRoles": ["anonymous", "authenticated"]
       },
       {
         "route": "/*",
         "allowedRoles": ["authenticated"]
       }
     ],
     "responseOverrides": {
       "401": {
         "redirect": "/.auth/login/aad?post_login_redirect_uri=.referrer",
         "statusCode": 302
       }
     },
     "auth": {
       "identityProviders": {
         "azureActiveDirectory": {
           "registration": {
             "openIdIssuer": "https://login.microsoftonline.com/YOUR_TENANT_ID/v2.0",
             "clientIdSettingName": "AAD_CLIENT_ID",
             "clientSecretSettingName": "AAD_CLIENT_SECRET"
           }
         }
       }
     }
   }
   ```

2. **`src/lib/stores/userStore.js`**
   - Writable store for user authentication state
   - Loading state management

3. **`src/routes/+layout.server.js`**
   - Server-side authentication data fetching
   - Prerender prevention

4. **`README_SSO_SETUP.md`**
   - Comprehensive setup guide for Azure configuration

### Modified Files

1. **`src/routes/+layout.svelte`**
   - Added user store integration
   - Implemented client-side auth checks

2. **`src/routes/Header.svelte`**
   - Added user welcome message
   - Implemented logout button
   - Mobile-responsive auth UI

3. **`src/routes/+page.svelte`**
   - Added authentication guards
   - Implemented loading states
   - Added sign-in prompt for unauthenticated users

4. **`src/routes/+page.js`**
   - Changed `export const prerender = true` to `false`

5. **`src/routes/about/+page.js`**
   - Disabled prerendering

6. **`src/routes/sverdle/how-to-play/+page.js`**
   - Disabled prerendering

7. **`package.json`**
   - Updated build script to copy custom config
   - Fixed Node.js version requirement

8. **`svelte.config.js`**
   - Added prerender configuration
   - Configured error handling

## Issues Encountered and Solutions

### Issue 1: GitHub Actions Build Failure - Route Ordering

**Error Message**:
```
A route is covered up by a wildcard route and would not be evaluated.
Route: /.auth/login/*, Wildcard(s): /*
```

**Root Cause**:
Azure Static Web Apps evaluates routes in order. The wildcard route `/*` was placed before specific auth routes, causing it to catch all requests including authentication endpoints.

**Solution**:
Reordered routes in `staticwebapp.config.json` to place specific routes (`/.auth/login/*`, `/.auth/logout`, `/.auth/me`) before the wildcard route (`/*`).

### Issue 2: Prerendering Attempting to Access Auth Endpoints

**Error Message**:
```
SvelteKitError: Not found: /.auth/login/aad
404 /.auth/login/aad (linked from /)
```

**Root Cause**:
SvelteKit's build process attempts to prerender all pages and follows all links. During build time, the Azure authentication endpoints (`/.auth/*`) don't exist, causing 404 errors when the prerenderer tries to crawl these links.

**Solution**:
1. Disabled prerendering globally by setting `export const prerender = false` in all page files
2. Added `data-sveltekit-preload-data="off"` attribute to all authentication links
3. Implemented build-time detection in `+layout.server.js` to skip auth checks during prerendering
4. Configured `svelte.config.js` to handle HTTP errors as warnings

### Issue 3: Node.js Version Incompatibility

**Error Message**:
```
npm error engine Not compatible with your version of node/npm
Required: {"node":"^20.0.0"}
Actual: {"npm":"11.5.2","node":"v22.18.0"}
```

**Root Cause**:
The package.json specified Node.js version `^20.0.0` which excludes version 22.x.

**Solution**:
Changed the Node.js version requirement from `^20.0.0` to `>=20.0.0` to allow newer versions.

### Issue 4: Azure SWA Adapter Override

**Root Cause**:
The `svelte-adapter-azure-swa` generates its own `staticwebapp.config.json` during build, overwriting our custom authentication configuration.

**Solution**:
Modified the build script in `package.json` to copy our custom configuration after the build completes:
```json
"build": "vite build && cp staticwebapp.config.json build/staticwebapp.config.json"
```

## Technical Deep Dive

### Authentication Flow Details

1. **Initial Request**
   - User accesses any route in the application
   - Azure Static Web Apps edge checks authentication status

2. **Unauthenticated Flow**
   - Edge returns 401 status
   - `responseOverrides` configuration triggers redirect to `/.auth/login/aad`
   - User authenticates with Microsoft Entra ID
   - Successful auth redirects back to original URL

3. **Authenticated Flow**
   - Edge allows request to proceed
   - `+layout.server.js` fetches user data from `/.auth/me`
   - User data populates global store
   - Components reactively update based on auth state

### State Management Architecture

```javascript
// Global store structure
userStore = {
  identityProvider: "aad",
  userId: "unique-user-id",
  userDetails: "user@domain.com",
  userRoles: ["anonymous", "authenticated"],
  claims: [...]
}

authLoading = boolean // Tracks authentication check status
```

### Server-Side vs Client-Side Rendering

The implementation uses a hybrid approach:
- **Server-side**: Initial authentication check and data fetching
- **Client-side**: Store updates and reactive UI changes
- **Edge**: Primary authentication enforcement

This ensures:
- Fast initial page loads
- No authentication flicker
- Secure server-side validation
- Reactive client updates

## Security Considerations

### Implemented Security Measures

1. **Edge-Level Authentication**
   - All authentication checks happen at the Azure Static Web Apps edge
   - No unauthenticated requests reach the application

2. **Tenant Restriction**
   - Configuration restricts access to specific Microsoft Entra ID tenant
   - Prevents external Microsoft accounts from accessing the application

3. **Secure Token Handling**
   - Authentication tokens managed by Azure Static Web Apps
   - No client-side token storage
   - Automatic token refresh

4. **Session Management**
   - Sessions managed by Azure infrastructure
   - Secure logout clears all session data
   - Post-logout redirect to home page

### Security Best Practices Applied

1. **Principle of Least Privilege**
   - Only authenticated users have access
   - Role-based access control ready for expansion

2. **Defense in Depth**
   - Multiple layers of authentication checks
   - Server-side validation
   - Client-side guards

3. **Secure by Default**
   - All routes protected by default
   - Explicit allowlist for public endpoints

## Testing and Validation

### Build Validation
- ✅ Local build completes successfully
- ✅ No prerender errors
- ✅ Custom configuration properly applied
- ✅ GitHub Actions build passes

### Authentication Flow Testing
- ✅ Unauthenticated users redirected to login
- ✅ Successful authentication returns to original page
- ✅ User information displayed correctly
- ✅ Logout functionality works

### Security Testing
- ✅ Direct route access blocked without authentication
- ✅ API endpoints protected
- ✅ Tenant restriction enforced

## Lessons Learned

### Key Insights

1. **Route Ordering Matters**
   - Azure Static Web Apps evaluates routes sequentially
   - Specific routes must precede wildcards
   - Order impacts functionality

2. **Prerendering Challenges**
   - SvelteKit aggressively prerenders by default
   - External authentication endpoints cause build failures
   - Explicit prerender configuration required

3. **Adapter Behavior**
   - Build adapters may override configuration
   - Post-build steps may be necessary
   - Understanding adapter behavior crucial

4. **Server-Side First**
   - Server-side authentication more secure
   - Prevents authentication flicker
   - Better performance than client-only

### Best Practices Established

1. **Documentation**
   - Document all configuration decisions
   - Provide clear setup instructions
   - Include troubleshooting guides

2. **Testing Strategy**
   - Test build process locally first
   - Validate all authentication flows
   - Check edge cases

3. **Configuration Management**
   - Keep authentication config separate
   - Use environment variables for secrets
   - Version control configuration

## Conclusion

The SSO implementation successfully transforms the M&S EchoEngine chatbot from a public application to a secure, tenant-restricted internal tool. The solution leverages Azure Static Web Apps' built-in authentication capabilities while maintaining a smooth user experience.

The implementation overcomes several technical challenges related to SvelteKit's build process and Azure's configuration requirements, resulting in a robust and maintainable authentication system.

### Future Enhancements

Potential improvements for future iterations:

1. **Role-Based Access Control**
   - Implement granular permissions
   - Add admin vs user roles
   - Feature flagging based on roles

2. **Audit Logging**
   - Track user access patterns
   - Monitor authentication events
   - Security compliance reporting

3. **Multi-Tenant Support**
   - Allow multiple tenant configurations
   - Tenant-specific customization
   - Cross-tenant isolation

4. **Enhanced User Experience**
   - Remember user preferences
   - Personalized greetings
   - Session timeout warnings

## Appendix

### File Structure
```
project/
├── staticwebapp.config.json       # Azure SWA configuration
├── src/
│   ├── lib/
│   │   └── stores/
│   │       └── userStore.js      # Authentication state
│   └── routes/
│       ├── +layout.server.js     # Server-side auth
│       ├── +layout.svelte         # Client integration
│       ├── +page.svelte           # Protected main page
│       ├── +page.js               # Page configuration
│       └── Header.svelte          # User UI components
├── docs/
│   ├── sso_implementation.md     # This document
│   └── microsoft-docs.md         # Reference docs
└── README_SSO_SETUP.md           # Setup instructions
```

### Configuration Reference

Key configuration files and their purposes:

1. **staticwebapp.config.json**: Azure Static Web Apps routing and authentication
2. **package.json**: Build scripts and dependencies
3. **svelte.config.js**: SvelteKit configuration
4. **+layout.server.js**: Server-side authentication logic
5. **userStore.js**: Client-side state management

---

*Document Version: 1.0*
*Last Updated: January 2025*
*Implementation Completed Successfully*