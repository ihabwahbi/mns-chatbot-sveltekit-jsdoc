# ⚠️ CRITICAL: REVERT SECURITY CHANGES BEFORE MERGING ⚠️

## THIS FILE IS A REMINDER TO RESTORE AUTHENTICATION BEFORE MERGING TO PRODUCTION

### Current Status: AUTHENTICATION DISABLED FOR PREVIEW TESTING

The authentication has been temporarily disabled in `staticwebapp.config.json` to allow preview environment testing without login requirements.

## ❗ BEFORE MERGING THIS BRANCH TO MASTER ❗

You **MUST** restore the secure configuration in both `staticwebapp.config.json` AND `src/routes/+layout.server.js`:

### Step 1a: Restore the Secure Configuration in staticwebapp.config.json

Replace the current content of `staticwebapp.config.json` with:

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
  "navigationFallback": {
    "rewrite": "/index.html"
  },
  "auth": {
    "identityProviders": {
      "azureActiveDirectory": {
        "registration": {
          "openIdIssuer": "https://login.microsoftonline.com/41ff26dc-250f-4b13-8981-739be8610c21/v2.0",
          "clientIdSettingName": "AAD_CLIENT_ID",
          "clientSecretSettingName": "AAD_CLIENT_SECRET"
        }
      }
    }
  },
  "globalHeaders": {
    "Cache-Control": "no-cache"
  }
}
```

### Step 1b: Disable Preview Mode in +layout.server.js

In `src/routes/+layout.server.js`, change line 15 from:
```javascript
const PREVIEW_MODE = true; // Set to false before merging to production
```

To:
```javascript
const PREVIEW_MODE = false; // Set to false before merging to production
```

Or remove the entire PREVIEW_MODE block (lines 13-27).

### Step 1c: Disable Preview Mode in +layout.svelte

In `src/routes/+layout.svelte`, change line 10 from:
```javascript
const PREVIEW_MODE = true;
```

To:
```javascript
const PREVIEW_MODE = false;
```

Or remove the entire PREVIEW_MODE block and the associated onMount logic.

### Step 2: Commit the Restoration

```bash
git add staticwebapp.config.json
git commit -m "security: Restore authentication for production merge"
git push
```

### Step 3: Delete This Reminder File

After restoring the authentication, delete this reminder file:

```bash
git rm IMPORTANT_REVERT_BEFORE_MERGE.md
git commit -m "chore: Remove security reminder file"
git push
```

## Why This Is Critical

- **Current State**: The application is publicly accessible without authentication
- **Security Risk**: If merged to production, your application will be exposed to the public
- **Data Protection**: Your chatbot and its data must remain protected behind authentication

## Checklist Before Merge

- [ ] `staticwebapp.config.json` has `"allowedRoles": ["authenticated"]` for the `/*` route
- [ ] `auth` section is restored and not commented out
- [ ] `responseOverrides` section is restored for 401 redirects
- [ ] `PREVIEW_MODE` is set to `false` in `src/routes/+layout.server.js`
- [ ] `PREVIEW_MODE` is set to `false` in `src/routes/+layout.svelte`
- [ ] This reminder file is deleted
- [ ] All tests pass with authentication enabled

---

**Date Disabled**: January 2025
**Branch**: feature/test-previews
**Reason**: Preview environment testing for colleagues without Azure AD access

⚠️ **DO NOT MERGE WITHOUT REVERTING THESE CHANGES** ⚠️