# google
A Facade to use Google Authentication API

This is a facade for using gapi. I consider the available examples a little bit boring and less reusable... not so much intuitive. For this I wrote this file to help me using gapi for authentication and so on in another projects.

> REMEMBER (for me [LOL]) Add the whole process (or link to a how to) of filling the Google requirements, step by step.

## TODOS
1. Apply JavaScript module properties, package.json, et coetera
1. Add building routines

## Usage

```javascript

// Creating...
var foo = new Google({
	apiKey: '...',
	discoveryDocs: [
		'https://www.googleapis.com/discovery/v1/apis/admin/directory_v1/rest',
		'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
		'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest',
		'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
	],
	clientId: '...',
	scope: 'https://www.googleapis.com/auth/admin.directory.user.readonly https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/gmail.send profile email',
}, function (user, authorized, authorizationToken, authInstance) {

	if (authorized !== undefined && authorizationToken !== undefined) {

		gapi.client.directory.users.list({
			'customer': 'my_customer',
			'maxResults': 100,
			'orderBy': 'email'
		}).then(function (response) {

			if (response.result && response.result.users) {

				response.result.users.forEach(function (user) {

					console.log(user.name.fullName);

				});

			}

		});

	}

});

// Using (when needed)...

/**
 * Returns the GoogleAuthInstance (Object)
 */
foo.getAuthInstance();

/**
 *  Returns the authenticated user (Object)
 */
foo.getUser();

/**
 * Returns the authorization token (String)
 */
foo.getAuthorizationToken();

/**
 * Returns the configuration used in constructor (Object)
 */
foo.getConfiguration();

/**
 * Returns if scope is authorized or not (Boolean)
 */
foo.hasGrantedScopes();

// Disconnecting...

/**
 * deAuthenticate - true for use authInstance.disconnect and revoke permissions
 * deAuthenticate - false for use authInstance.signOut and just logout
 */
foo.disconnect(deAuthenticate, function () {

	console.log('Disconnected out Signed out');

});
```
