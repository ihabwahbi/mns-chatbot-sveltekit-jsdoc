# SSO Setup Guide for EchoEngine M&S

This guide provides instructions for completing the SSO setup for your SvelteKit application deployed on Azure Static Web Apps.

## Prerequisites

- Azure subscription with appropriate permissions
- Azure Static Web Apps resource (Standard plan required for custom authentication)
- Microsoft Entra ID tenant

## Configuration Steps

### 1. Create Microsoft Entra ID App Registration

1. Navigate to Azure Portal → Microsoft Entra ID → App registrations
2. Click "New registration"
3. Configure the app:
   - **Name**: EchoEngine M&S (or your preferred name)
   - **Supported account types**: "Accounts in this organizational directory only" (for tenant restriction)
   - **Redirect URI**:
     - Platform: Web
     - URI: `https://<YOUR_STATIC_WEB_APP_URL>/.auth/login/aad/callback`

4. After creation, note down:
   - **Application (client) ID**
   - **Directory (tenant) ID**

5. Create a client secret:
   - Go to "Certificates & secrets"
   - Click "New client secret"
   - Add description and expiry
   - **Important**: Copy the secret value immediately (it won't be shown again)

### 2. Configure Azure Static Web Apps

1. Navigate to your Static Web Apps resource in Azure Portal
2. Go to Configuration → Application settings
3. Add the following settings:

   | Name | Value |
   |------|-------|
   | `AAD_CLIENT_ID` | Your Application (client) ID from step 1 |
   | `AAD_CLIENT_SECRET` | Your client secret value from step 1 |

4. Click "Save"

### 3. Update staticwebapp.config.json

The configuration file has been pre-configured, but you need to update the tenant ID:

1. Open `staticwebapp.config.json`
2. Replace `YOUR_TENANT_ID` in the `openIdIssuer` URL with your actual Directory (tenant) ID:
   ```json
   "openIdIssuer": "https://login.microsoftonline.com/<YOUR_ACTUAL_TENANT_ID>/v2.0"
   ```
3. Commit and push the changes to trigger a new deployment

### 4. Testing the Authentication Flow

After deployment:

1. Navigate to your Static Web Apps URL
2. You should be automatically redirected to Microsoft login
3. Sign in with an account from your tenant
4. After successful authentication, you should see:
   - User's name in the header
   - Access to the chat interface
   - Logout button

### 5. Troubleshooting

**Issue: Users from other tenants can still log in**
- Ensure the `openIdIssuer` URL includes your specific tenant ID, not "common"
- Verify the app registration is set to single-tenant

**Issue: Getting 401 errors**
- Check that AAD_CLIENT_ID and AAD_CLIENT_SECRET are correctly set in Application Settings
- Ensure the redirect URI in app registration matches exactly

**Issue: Authentication loop**
- Clear browser cookies for the domain
- Check that the staticwebapp.config.json is properly deployed

## Security Considerations

1. **Client Secret Rotation**: Set a reminder to rotate the client secret before expiry
2. **Tenant Restriction**: The current setup restricts to a single tenant. For multi-tenant, change to "common"
3. **Role Management**: Currently using built-in roles (anonymous, authenticated). Custom roles can be added if needed

## Local Development

For local development, authentication is emulated. You can test with mock authentication using SWA CLI:

```bash
npm install -g @azure/static-web-apps-cli
swa start http://localhost:5173 --api-location ./api
```

## Additional Resources

- [Azure Static Web Apps Authentication Documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/authentication-authorization)
- [Microsoft Entra ID App Registration](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)
- [SvelteKit Documentation](https://kit.svelte.dev/docs)