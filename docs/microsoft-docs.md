Authenticate and authorize Static Web Apps
10/11/2023
Azure Static Web Apps provides a streamlined authentication experience, where no extra configuration is required to use GitHub and Microsoft Entra ID for authentication. All features listed in this article are available in all Static Web Apps plans.

In this article, learn about default behavior, how to set up sign-in and sign-out, how to block an authentication provider, and more. To read the auth details for a specific use, see Access user information.

You can register a custom provider, which disables all pre-configured providers.

 Warning

Due to changes in X (formerly Twitter) API policy, support is not available as part of the pre-configured providers for your app. If you want to continue to use X (formerly Twitter) for authentication/authorization with your app, update your app configuration to register a custom provider.

Prerequisites
Be aware of the following defaults and resources for authentication and authorization with Azure Static Web Apps.

Defaults:

Any user can authenticate with a preconfigured provider
GitHub
Microsoft Entra ID
To restrict an authentication provider, block access with a custom route rule
After sign-in, users belong to the anonymous and authenticated roles. For more information about roles, see Manage roles
Resources:

Define rules in the staticwebapp.config.json file for authorized users to gain access to restricted routes
Assign users custom roles using the built-in invitations system
Programmatically assign users custom roles at sign-in with an API function
Understand that authentication and authorization significantly overlap with routing concepts, which are detailed in the Application configuration guide
Restrict sign-in to a specific Microsoft Entra ID tenant by configuring a custom Microsoft Entra ID provider. The preconfigured Microsoft Entra ID provider allows any Microsoft account to sign in.
Set up sign-in
Azure Static Web Apps uses the /.auth system folder to provide access to authorization-related APIs. Rather than expose any of the routes under the /.auth folder directly to end users, create routing rules for friendly URLs.

Use the following table to find the provider-specific route.

Authorization provider	Sign in route
Microsoft Entra ID	/.auth/login/aad
GitHub	/.auth/login/github
For example, to sign in with GitHub, you could use a URL similar to the following example.

HTML

Copy
<a href="/.auth/login/github">Login</a>
If you chose to support more than one provider, use a provider-specific link for each provider on your website. Use a route rule to map a default provider to a friendly route like /login.

JSON

Copy
{
  "route": "/login",
  "redirect": "/.auth/login/github"
}
Set up post-sign-in redirect
You can return a user to a specific page after they sign in by providing a fully qualified URL in the post_login_redirect_uri query string parameter.

HTML

Copy
<a href="/.auth/login/github?post_login_redirect_uri=https://zealous-water.azurestaticapps.net/success">Login</a>
You can also redirect unauthenticated users back to the referring page after they sign in. To add this redirect, create a response override rule that sets post_login_redirect_uri to .referrer, like in the following example.

JSON

Copy
{
  "responseOverrides": {
    "401": {
      "redirect": "/.auth/login/github?post_login_redirect_uri=.referrer",
      "statusCode": 302
    }
  }
}
Set up sign-out
The /.auth/logout route signs users out from the website. You can add a link to your site navigation to allow the user to sign out, like in the following example.

HTML

Copy
<a href="/.auth/logout">Log out</a>
Use a route rule to map a friendly route like /logout.

JSON

Copy
{
  "route": "/logout",
  "redirect": "/.auth/logout"
}
Set up post-sign-out redirect
To return a user to a specific page after they sign out, provide a URL in post_logout_redirect_uri query string parameter.

Block an authentication provider
By default, all authentication providers are enabled, but you may want to restrict your app from using a provider. For instance, your app may want to only use providers that expose email addresses.

To block a provider, create a route rule to return a 404 status code for requests to the blocked provider-specific route. For example, to restrict Entra ID (formerly Azure Active Directory, known as "aad") provider, add the following route rule.

JSON

Copy
{
  "route": "/.auth/login/aad",
  "statusCode": 404
}
Remove personal data
When you grant consent to an application as an end user, the application has access to your email address or username, depending on the identity provider. Once this information is provided, the owner of the application can decide how to manage personal data.

End users need to contact administrators of individual web apps to revoke this information from their systems.

To remove personal data from the Azure Static Web Apps platform, and prevent the platform from providing this information on future requests, submit a request using the following URL:

url

Copy
https://identity.azurestaticapps.net/.auth/purge/<AUTHENTICATION_PROVIDER_NAME>
To prevent the platform from providing this information on future requests to individual apps, submit a request using the following URL:

url

Copy
https://<WEB_APP_DOMAIN_NAME>/.auth/purge/<AUTHENTICATION_PROVIDER_NAME>
If you're using Microsoft Entra ID, use aad as the value for the <AUTHENTICATION_PROVIDER_NAME> placeholder.

 Tip

For information about general restrictions and limitations, see Quotas.

Accessing user information in Azure Static Web Apps
01/29/2025
Azure Static Web Apps provides authentication-related user information via a direct-access endpoint and to API functions.

Many user interfaces rely heavily on user authentication data. The direct-access endpoint is a utility API that exposes user information without having to implement a custom function. Beyond convenience, the direct-access endpoint isn't subject to cold start delays that are associated with serverless architecture.

This article shows you how to read user information from a deployed application. If you want to read emulated user information during local development, see Authorization and authentication emulation.

Client principal data
Client principal data object exposes user-identifiable information to your app. The following properties are featured in the client principal object:

Property	Description
identityProvider	The name of the identity provider.
userId	An Azure Static Web Apps-specific unique identifier for the user.
The value is unique on a per-app basis. For instance, the same user returns a different userId value on a different Static Web Apps resource.
The value persists for the lifetime of a user. If you delete and add the same user back to the app, a new userId is generated.
userDetails	Username or email address of the user. Some providers return the user's email address, while others send the user handle.
userRoles	An array of the user's assigned roles.
claims	An array of claims returned by your custom authentication provider. Only accessible in the direct-access endpoint.
The following example is a sample client principal object:

JSON

Copy
{
  "identityProvider": "github",
  "userId": "abcd12345abcd012345abcdef0123450",
  "userDetails": "username",
  "userRoles": ["anonymous", "authenticated"],
  "claims": [{
    "typ": "name",
    "val": "Azure Static Web Apps"
  }]
}
Direct-access endpoint
You can send a GET request to the /.auth/me route and receive direct access to the client principal data. When the state of your view relies on authorization data, use this approach for the best performance.

For logged-in users, the response contains a client principal JSON object. Requests from unauthenticated users returns null.

Using the fetch1 API, you can access the client principal data using the following syntax.

JavaScript

Copy
async function getUserInfo() {
  const response = await fetch('/.auth/me');
  const payload = await response.json();
  const { clientPrincipal } = payload;
  return clientPrincipal;
}

(async () => {
console.log(await getUserInfo());
})();
API functions
The API functions available in Static Web Apps via the Azure Functions backend have access to the same user information as a client application, with the exception of the claims array. While the API does receive user-identifiable information, it does not perform its own checks if the user is authenticated or if they match a required role. Access control rules are defined in the staticwebapp.config.json file.

JavaScript
C#
Client principal data is passed to API functions in the x-ms-client-principal request header. The client principal data is sent as a Base64-encoded string containing a serialized JSON object.

The following example function shows how to read and return user information.

JavaScript

Copy
module.exports = async function (context, req) {
  const header = req.headers.get('x-ms-client-principal');
  const encoded = Buffer.from(header, 'base64');
  const decoded = encoded.toString('ascii');

  context.res = {
    body: {
      clientPrincipal: JSON.parse(decoded),
    },
  };
};
Assuming the above function is named user, you can use the fetch1 browser API to access the API's response using the following syntax.

JavaScript

Copy
async function getUser() {
  const response = await fetch('/api/user');
  const payload = await response.json();
  const { clientPrincipal } = payload;
  return clientPrincipal;
}

console.log(await getUser());
When a user is logged in, the x-ms-client-principal header is added to the requests for user information via the Static Web Apps edge nodes.

 Note

The x-ms-client-principal header accessible in the API function does not contain the claims array.

1 The fetch API and await operator aren't supported in Internet Explorer.

Custom authentication in Azure Static Web Apps
07/09/2024
Azure Static Web Apps provides managed authentication that uses provider registrations managed by Azure. To enable more flexibility over the registration, you can override the defaults with a custom registration.

Custom authentication also allows you to configure custom providers that support OpenID Connect. This configuration allows the registration of multiple external providers.

Using any custom registrations disables all preconfigured providers.

 Note

Custom authentication is only available in the Azure Static Web Apps Standard plan.

Configure a custom identity provider
Custom identity providers are configured in the auth section of the configuration file.

To avoid putting secrets in source control, the configuration looks into application settings for a matching name in the configuration file. You might also choose to store your secrets in Azure Key Vault.

Microsoft Entra ID
Apple
Facebook
GitHub
Google
X
OpenID Connect
To create the registration, begin by creating the following application settings:

Setting Name	Value
AZURE_CLIENT_ID	The Application (client) ID for the Microsoft Entra app registration.
AZURE_CLIENT_SECRET_APP_SETTING_NAME	The name of the application setting that holds the client secret for the Microsoft Entra app registration.
Next, use the following sample to configure the provider in the configuration file.

Microsoft Entra providers are available in two different versions. Version 1 explicitly defines the userDetailsClaim, which allows the payload to return user information. By contrast, version 2 returns user information by default, and is designated by v2.0 in the openIdIssuer URL.


Microsoft Entra Version 1
JSON

Copy
{
  "auth": {
    "identityProviders": {
      "azureActiveDirectory": {
        "userDetailsClaim": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
        "registration": {
          "openIdIssuer": "https://login.microsoftonline.com/<TENANT_ID>",
          "clientIdSettingName": "AZURE_CLIENT_ID",
          "clientSecretSettingName": "AZURE_CLIENT_SECRET_APP_SETTING_NAME"
        }
      }
    }
  }
}
Make sure to replace <TENANT_ID> with your Microsoft Entra tenant ID.


Microsoft Entra Version 2
JSON

Copy
{
  "auth": {
    "identityProviders": {
      "azureActiveDirectory": {
        "registration": {
          "openIdIssuer": "https://login.microsoftonline.com/<TENANT_ID>/v2.0",
          "clientIdSettingName": "AZURE_CLIENT_ID",
          "clientSecretSettingName": "AZURE_CLIENT_SECRET_APP_SETTING_NAME"
        }
      }
    }
  }
}
Make sure to replace <TENANT_ID> with your Microsoft Entra tenant ID.

For more information on how to configure Microsoft Entra ID, see the App Service Authentication/Authorization documentation on using an existing registration.

To configure which accounts can sign in, see Modify the accounts supported by an application and Restrict your Microsoft Entra app to a set of users in a Microsoft Entra tenant.

 Note

While the configuration section for Microsoft Entra ID is azureActiveDirectory, the platform aliases this to aad in the URL's for login, logout and purging user information. Refer to the authentication and authorization section for more information.

Custom certificate
Use the following steps to add a custom certificate to your Microsoft Entra ID app registration.

If it isn't already, upload your certificate to a Microsoft Key Vault.

Add a managed identity on your Static Web App.

For user assigned managed identities, set keyVaultReferenceIdentity property on your static site object to the resourceId of the user assigned managed identity.

Skip this step if your managed identity is system assigned.

Grant the managed identity the following access policies:

Secrets: Get/List
Certificates: Get/List
Update the auth config section of the azureActiveDirectory configuration section with a clientSecretCertificateKeyVaultReference value as shown in the following example:

JSON

Copy
{
  "auth": {
    "rolesSource": "/api/GetRoles",
    "identityProviders": {
      "azureActiveDirectory": {
        "userDetailsClaim": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
        "registration": {
          "openIdIssuer": "https://login.microsoftonline.com/common/v2.0",
          "clientIdSettingName": "AZURE_CLIENT_ID",
          "clientSecretCertificateKeyVaultReference": "@Microsoft.KeyVault(SecretUri=https://<KEY_VAULT_NAME>.azure.net/certificates/<CERTIFICATE_NAME>/<CERTIFICATE_VERSION_ID>)",
          "clientSecretCertificateThumbprint": "*"
        }
      }
    }
  }
}
Make sure to replace your values in for the placeholders surrounded by <>.

In the secret URI, specify the key vault name and certificate name. If you want to pin to a version, include the certificate version, otherwise omit the version to allow the runtime to select the newest version of the certificate.

Set clientSecretCertificateThumbprint equal to * to always pull the latest version of the certificates thumbprint.

Authentication callbacks
Identity providers require a redirect URL to complete the login or logout request. Most providers require that you add the callback URLs to an allowlist. The following endpoints are available as redirect destinations.

Type	URL pattern
Login	https://<YOUR_SITE>/.auth/login/<PROVIDER_NAME_IN_CONFIG>/callback
Logout	https://<YOUR_SITE>/.auth/logout/<PROVIDER_NAME_IN_CONFIG>/callback
If you're using Microsoft Entra ID, use aad as the value for the <PROVIDER_NAME_IN_CONFIG> placeholder.

 Note

These URLs are provided by Azure Static Web Apps to receive the response from the authentication provider, you don't need to create pages at these routes.

Login, logout, and user details
To use a custom identity provider, use the following URL patterns.

Action	Pattern
Login	/.auth/login/<PROVIDER_NAME_IN_CONFIG>
Logout	/.auth/logout
User details	/.auth/me
Purge user details	/.auth/purge/<PROVIDER_NAME_IN_CONFIG>
If you're using Microsoft Entra ID, use aad as the value for the <PROVIDER_NAME_IN_CONFIG> placeholder.

Manage roles
Every user who accesses a static web app belongs to one or more roles. There are two built-in roles that users can belong to:

anonymous: All users automatically belong to the anonymous role.
authenticated: All users who are signed in belong to the authenticated role.
Beyond the built-in roles, you can assign custom roles to users, and reference them in the staticwebapp.config.json file.

Invitations
Function (preview)
Add a user to a role
To add a user to a role, you generate invitations that allow you to associate users to specific roles. Roles are defined and maintained in the staticwebapp.config.json file.


Create an invitation
Invitations are specific to individual authorization-providers, so consider the needs of your app as you select which providers to support. Some providers expose a user's email address, while others only provide the site's username.


Authorization provider	Exposes
Microsoft Entra ID	email address
GitHub	username
X	username
Use the following steps to create an invitation.

Go to a Static Web Apps resource in the Azure portal.
Under Settings, select Role Management.
Select Invite.
Select an Authorization provider from the list of options.
Add either the username or email address of the recipient in the Invitee details box.
For GitHub and X, enter the username. For all others, enter the recipient's email address.
Select the domain of your static site from the Domain drop-down menu.
The domain you select is the domain that appears in the invitation. If you have a custom domain associated with your site, choose the custom domain.
Add a comma-separated list of role names in the Role box.
Enter the maximum number of hours you want the invitation to remain valid.
The maximum possible limit is 168 hours, which is seven days.
Select Generate.
Copy the link from the Invite link box.
Email the invitation link to the user that you're granting access to.
When the user selects the link in the invitation, they're prompted to sign in with their corresponding account. Once successfully signed in, the user is associated with the selected roles.

 Caution

Make sure your route rules don't conflict with your selected authentication providers. Blocking a provider with a route rule prevents users from accepting invitations.

Update role assignments
Go to a Static Web Apps resource in the Azure portal.
Under Settings, select Role Management.
Select the user in the list.
Edit the list of roles in the Role box.
Select Update.
Remove user
Go to a Static Web Apps resource in the Azure portal.
Under Settings, select Role Management.
Locate the user in the list.
Check the checkbox on the user's row.
Select Delete.
As you remove a user, keep in mind the following items:

Removing a user invalidates their permissions.
Worldwide propagation might take a few minutes.
If the user is added back to the app, the userId changes.

Configure private endpoint in Azure Static Web Apps
08/03/2023
You can use a private endpoint (also called private link) to restrict access to your static web app so that it is only accessible from your private network.

How it works
An Azure Virtual Network (VNet) is a network just like you might have in a traditional data center, but resources within the VNet talk to each other securely on the Microsoft backbone network.

Configuring Static Web Apps with a private endpoint allows you to use a private IP address from your VNet. Once this link is created, your static web app is integrated into your VNet. As a result, your static web app is no longer available to the public internet, and is only accessible from machines within your Azure VNet.

 Note

Placing your application behind a private endpoint means your app is only available in the region where your VNet is located. As a result, your application is no longer available across multiple points of presence.

If your app has a private endpoint enabled, the server responds with a 403 status code if the request comes from a public IP address. This behavior applies to both the production environment as well as any staging environments. The only way to reach the app is to use the private endpoint deployed within your VNet.

The default DNS resolution of the static web app still exists and routes to a public IP address. The private endpoint exposes 2 IP Addresses within your VNet, one for the production environment and one for any staging environments. To ensure your client is able to reach the app correctly, make sure your client resolves the hostname of the app to the appropriate IP address of the private endpoint. This is required for the default hostname as well as any custom domains configured for the static web app. This resolution is done automatically if you select a private DNS zone when creating the private endpoint (see example below) and is the recommended solution.

If you are connecting from on-prem or do not wish to use a private DNS zone, manually configure the DNS records for your application so that requests are routed to the appropriate IP address of the private endpoint. You can find more information on private endpoint DNS resolution here.

 Note

Private endpoints restrict the incoming traffic going to the website to a specific virtual network. They do not apply to deployments of new site assets.

Prerequisites
An Azure account with an active subscription.
Create an account for free.
An Azure VNet.
An application deployed with Azure Static Web Apps that uses the Standard hosting plan.
Create a private endpoint
In this section, you create a private endpoint for your static web app.

 Important

Your static web app must be deployed on the Standard hosting plan to use Private endpoints. You can change the hosting plan from the Hosting Plan option in the side menu.

In the portal, open your static web app.

Select the Private Endpoints option from the side menu.

Select Add.

In the "Add Private Endpoint" dialog, enter this information:

Setting	Value
Name	Enter myPrivateEndpoint.
Subscription	Select your subscription.
Virtual Network	Select your virtual network.
Subnet	Select your subnet.
Integrate with private DNS zone	Leave the default of Yes.
Screenshot of the Add Private Endpoint dialog in the Azure portal.

Select Ok.

 Note

The name of the private DNS zone depends upon the default domain name suffix of the static web app. For example, if the default domain suffix of the app is 3.azurestaticapps.net, the name of the private DNS zone is privatelink.3.azurestaticapps.net. When a new static web app is created, the default domain suffix might be different from the default domain suffix(es) of previous static web apps. If you are using an automated deployment process to create the private DNS zone, you can use the DefaultHostname property in your app to programmatically extract the domain suffix. The DefaultHostname property value resembles <STATIC_WEB_APP_DEFAULT_DOMAIN_PREFIX>.<PARTITION_ID>.azurestaticapps.net or STATIC_WEB_APP_DEFAULT_DOMAIN_PREFIX.azurestaticapps.net. The default domain suffix resembles <PARTITION_ID>.azurestaticapps.net or azurestaticapps.net.

Testing your private endpoint
Since your application is no longer publicly available, the only way to access it is from inside of your virtual network. To test, set up a virtual machine inside of your virtual network and go to your site.

Secure authentication secrets in Azure Key Vault for Azure Static Web Apps
07/09/2024
When configuring custom authentication providers, you may want to store connection secrets in Azure Key Vault. This article demonstrates how to use a managed identity to grant Azure Static Web Apps access to Key Vault for custom authentication secrets.

 Note

Azure Serverless Functions do not support direct Key Vault integration. If you require Key Vault integration with your managed Function app, you will need to implement Key Vault access into your app's code.

Security secrets require the following items to be in place.

Create a system-assigned identity in your static web app.
Grant the identity access to a Key Vault secret.
Reference the Key Vault secret from the Static Web Apps application settings.
This article demonstrates how to set up each of these items in production for bring your own functions applications.

Key Vault integration is not available for:

Staging versions of your static web app. Key Vault integration is only supported in the production environment.
Static web apps using managed functions.
 Note

Using managed identity is only available in the Azure Static Web Apps Standard plan.

Prerequisites
Existing Azure Static Web Apps site using bring your own functions.
Existing Key Vault resource with a secret value.
Create identity
Open your static web apps in the Azure portal.

Under Settings, select Identity.

Select the System assigned tab.

Under the Status label, select On.

Select Save.

Add system-assigned identity

When the confirmation dialog appears, select Yes.

Confirm identity assignment.

You can now add an access policy to allow your static web app to read Key Vault secrets.

Add a Key Vault access policy
Open your Key Vault resource in the Azure portal.

Under the Settings menu, select Access policies.

Select the link, Add Access Policy.

From the Secret permissions drop down, select Get.

Next to the Select principal label, select the None selected link.

In search box, search for your static web app name.

Select the list item that matches your application name.

Select Select.

Select Add.

Select Save.

Save Key Vault access policy

The access policy is now saved to Key Vault. Next, access the secret's URI to use when associating your static web app to the Key Vault resource.

Under the Settings menu, select Secrets.

Select your desired secret from the list.

Select your desired secret version from the list.

Select copy at end of Secret Identifier text box to copy the secret URI value to the clipboard.

Paste this value into a text editor for later use.

Add application setting
Open your Static Web Apps site in the Azure portal.

Under the Settings menu, select Configuration.

Under the Application settings section, select Add.

Enter a name in the text box for the Name field.

Determine the secret value in text box for the Value field.

The secret value is a composite of a few different values. The following template shows how the final string is built.

text

Copy
@Microsoft.KeyVault(SecretUri=<YOUR_KEY_VAULT_SECRET_URI>)
For example, a final string would look like the following sample:


Copy
@Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret/)
Alternatively:


Copy
@Microsoft.KeyVault(VaultName=myvault;SecretName=mysecret)
Use the following steps to build the full secret value.

Copy the template from above and paste it into a text editor.

Replace <YOUR_KEY_VAULT_SECRET_URI> with the Key Vault URI value you set aside earlier.

Copy the new full string value.

Paste the value into the text box for the Value field.

Select OK.

Select Save at the top of the Application settings toolbar.

Save application settings

Now when your custom authentication configuration references your newly created application setting, the value is extracted from Azure Key Vault using your static web app's identity.

Configure password protection (preview)
10/14/2022
You can use a password to protect your app's pre-production environments or all environments. Scenarios when password protection is useful include:

Limiting access to your static web app to people who have the password
Protecting your static web app's staging environments
Password protection is a lightweight feature that offers a limited level of security. To secure your app using an identity provider, use the integrated Static Web Apps authentication. You can also restrict access to your app using IP restrictions or a private endpoint.

Prerequisites
An existing static web app in the Standard plan.

Enable password protection
Open your static web app in the Azure portal.

Under Settings menu, select Configuration.

Select the General settings tab.

In the Password protection section, select Protect staging environments only to protect only your app's pre-production environments or select Protect both production and staging environments to protect all environments.

Screenshot of enabling password protection

Enter a password in Visitor password. Passwords must be at least eight characters long and contain a capital letter, a lowercase letter, a number, and a symbol.

Enter the same password in Confirm visitor password.

Select Save.

When visitors first go to a protected environment, they're prompted to enter the password before they can view the site.

Tutorial: Assign custom roles with a function and Microsoft Graph (preview)
12/13/2024
This article demonstrates how to use a function to query Microsoft Graph and assign custom roles to a user based on their Entra ID group membership.

In this tutorial, you learn to:

Deploy a static web app.
Create a Microsoft Entra app registration.
Set up custom authentication with Microsoft Entra ID.
Configure a serverless function that queries the user's Entra ID group membership and returns a list of custom roles.
 Note

This tutorial requires you to use a function to assign roles. Function-based role management is currently in preview. The permission level required to complete this tutorial is "User.Read.All".

There's a function named GetRoles in the app's API. This function uses the user's access token to query Entra ID from Microsoft Graph. If the user is a member of any groups defined in the app, then the corresponding custom roles are mapped to the user.

Prerequisites
Requirement	Comments
Active Azure account	If you don't have one, you can create an account for free.
Microsoft Entra permissions	You must have sufficient permissions to create a Microsoft Entra application.
Create a GitHub repository
Generate a repository based on the roles function template. Go to the following location to create a new repository.

https://github.com/staticwebdev/roles-function/generate

Name your repository my-custom-roles-app.

Select Create repository from template.

Deploy the static web app to Azure
In a new browser window, open the Azure portal.

From the top left corner, select Create a resource.

In the search box, type static web apps.

Select Static Web Apps.

Select Create.

Configure your static web app with the following information:

Setting	Value	Notes
Subscription	Select your Azure subscription.	
Resource group	Create a new group named my-custom-roles-app-group.	
Name	my-custom-roles-app	
Plan type	Standard	Customizing authentication and assigning roles using a function require the Standard plan.
Region for API	Select the region closest to you.	
In the Deployment details section:

Setting	Value
Source	Select GitHub.
Organization	Select the organization where you generated the repository.
Repository	Select my-custom-roles-app.
Branch	Select main.
In the Build Details section, add the configuration details for this app.

Setting	Value	Notes
Build presets	Select Custom.	
App location	Enter /frontend.	This folder contains the front end application.
API location	/api	Folder in the repository containing the API functions.
Output location	Leave blank.	This app has no build output.
Select Review + create.

Select Create initiate the first deployment.

Once the process is complete, select Go to resource to open your new static web app.

In the overview section, locate your application's URL. Copy this value into a text editor to use in upcoming steps to set up Entra authentication.


Create a Microsoft Entra application
In the Azure portal, search for and go to Microsoft Entra ID.

From the Manage menu, select App registrations.

Select New registration to open the Register an application window. Enter the following values:

Setting	Value	Notes
Name	Enter MyStaticWebApp.	
Supported account types	Select Accounts in this organizational directory only.	
Redirect URI	Select Web and enter the Microsoft Entra authentication callback URL of your static web app. Replace <YOUR_SITE_URL> in <YOUR_SITE_URL>/.auth/login/aad/callback with the URL of your static web app.	This URL is what you copied to a text editor in an earlier step.
Create an app registration

Select Register.

After the app registration is created, copy the Application (client) ID and Directory (tenant) ID in the Essentials section to a text editor.

You need these values to configure Entra ID authentication in your static web app.

Enable ID tokens
From the app registration settings, select Authentication under Manage.

In the Implicit grant and hybrid flows section, select ID tokens (used for implicit and hybrid flows).

The Static Web Apps runtime requires this configuration to authenticate your users.

Select Save.

Create a client secret
In the app registration settings, select Certificates & secrets under Manage.

In the Client secrets section, select New client secret.

For the Description field, enter MyStaticWebApp.

For the Expires field, leave the default value of 6 months.

 Note

You must rotate the secret before the expiration date by generating a new secret and updating your app with its value.

Select Add.

Copy the Value of the client secret you created to a text editor.

You need this value to configure Entra ID authentication in your static web app.

Create a client secret

Configure Entra ID authentication
In a browser, open the GitHub repository containing the static web app you deployed.

Go to the app's configuration file at frontend/staticwebapp.config.json. This file contains the following section:

JSON

Copy
"auth": {
  "rolesSource": "/api/GetRoles",
  "identityProviders": {
    "azureActiveDirectory": {
      "userDetailsClaim": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
      "registration": {
        "openIdIssuer": "https://login.microsoftonline.com/<YOUR_ENTRA_TENANT_ID>",
        "clientIdSettingName": "ENTRA_CLIENT_ID",
        "clientSecretSettingName": "ENTRA_CLIENT_SECRET"
      },
      "login": {
        "loginParameters": [
          "resource=https://graph.microsoft.com"
        ]
      }
    }
  }
},
This configuration is made up of the following settings:

Properties	Description
rolesSource	The URL where the login process gets a list of available roles. For the sample application the URL is /api/GetRoles.
userDetailsClaim	The URL of the schema used to validate the login request.
openIdIssuer	The Microsoft Entra login route, appended with your tenant ID.
clientIdSettingName	Your Microsoft Entra client ID.
clientSecretSettingName	Your Microsoft Entra client secret value.
loginParameters	To obtain an access token for Microsoft Graph, the loginParameters field must be configured with resource=https://graph.microsoft.com.
Select Edit to update the file.

Update the openIdIssuer value of https://login.microsoftonline.com/<YOUR_ENTRA_TENANT_ID> by replacing <YOUR_ENTRA_TENANT_ID> with the directory (tenant) ID of your Microsoft Entra ID.

Select Commit changes....

Enter a commit message, and select Commit changes.

Committing these changes initiates a GitHub Actions run to update the static web app.

Go to your static web app resource in the Azure portal.

Select Configuration in the menu bar.

In the Application settings section, add the following settings:

Name	Value
ENTRA_CLIENT_ID	Your Entra ID application (client) ID.
ENTRA_CLIENT_SECRET	Your Entra application client secret value.
Select Save.

Create roles
Open you Entra ID app registration in the Azure portal.

Under Manage, select App roles.

Select Create app role and enter the following values:

Setting	Value
Display name	Enter admin.
Allowed member types	Select Users/Groups.
Value	Enter admin.
Description	Enter Administrator.
Check the box for Do you want to enable this app role?

Select Apply.

Now repeat the same process for a role named reader.

Copy the ID values for each role and set them aside in a text editor.

Verify custom roles
The sample application contains an API function (api/GetRoles/index.js) that queries Microsoft Graph to determine if a user is in a predefined group.

Based on the user's group memberships, the function assigns custom roles to the user. The application is configured to restrict certain routes based on these custom roles.

In your GitHub repository, go to the GetRoles function located at api/GetRoles/index.js.

Near the top, there's a roleGroupMappings object that maps custom user roles to Microsoft Entra groups.

Select Edit.

Update the object with group IDs from your Microsoft Entra tenant.

For instance, if you have groups with IDs 6b0b2fff-53e9-4cff-914f-dd97a13bfbd6 and b6059db5-9cef-4b27-9434-bb793aa31805, you would update the object to:

JavaScript

Copy
const roleGroupMappings = {
  'admin': '6b0b2fff-53e9-4cff-914f-dd97a13bfbd6',
  'reader': 'b6059db5-9cef-4b27-9434-bb793aa31805'
};
The GetRoles function is called whenever a user is successfully authenticated with Microsoft Entra ID. The function uses the user's access token to query their Entra group membership from Microsoft Graph. If the user is a member of any groups defined in the roleGroupMappings object, then the corresponding custom roles are returned.

In the above example, if a user is a member of the Entra ID group with ID b6059db5-9cef-4b27-9434-bb793aa31805, they're granted the reader role.

Select Commit changes....

Add a commit message and select Commit changes.

Making these changes initiates a build in to update the static web app.

When the deployment is complete, you can verify your changes by navigating to the app's URL.

Sign in to your static web app using Microsoft Entra ID.

When you're logged in, the sample app displays the list of roles that you're assigned based on your identity's Entra ID group membership.

Depending on these roles, you're permitted or prohibited to access some of the routes in the app.

 Note

Some queries against Microsoft Graph return multiple pages of data. When more than one query request is required, Microsoft Graph returns an @odata.nextLink property in the response which contains a URL to the next page of results. For more information, see Paging Microsoft Graph data in your app

Clean up resources
Clean up the resources you deployed by deleting the resource group.

From the Azure portal, select Resource group from the left menu.

Enter the resource group name in the Filter by name field.

Select the resource group name you used in this tutorial.

Select Delete resource group from the top menu.