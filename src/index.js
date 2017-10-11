(function (__window) {

	const Google = function (configuration, __callback) {

		if ((!configuration) || !(configuration instanceof Object)) {

			throw new Error('Google API Wrapper - "configuration" must be defined!');

		}

		if ((!configuration.apiKey) || !(typeof(configuration.apiKey) === 'string') || (configuration.apiKey === '')) {

			throw new Error('Google API Wrapper - "apiKey" must be defined!');

		}

		if ((!configuration.discoveryDocs) || !(configuration.discoveryDocs instanceof Array) || (configuration.discoveryDocs.length === 0)) {

			throw new Error('Google API Wrapper - "discoveryDocs" must be a defined array!');

		}

		if ((!configuration.clientId) || !(typeof(configuration.clientId) === 'string') || (configuration.clientId === '')) {

			throw new Error('Google API Wrapper - "clientId" must be defined!');

		}

		if ((!configuration.scope) || !(typeof(configuration.scope) === 'string') || (configuration.scope === '')) {

			throw new Error('Google API Wrapper - "scope" must be defined!');

		}

		const thiz = this;

		/**
		 *
		 */
		this.element = document.createElement('script');

		this.element.type = 'text/javascript';
		this.element.async = true;
		this.element.defer = true;
		this.element.src = 'https://apis.google.com/js/api.js';

		/**
		 *
		 */
		this.element.onload = function () {

			gapi.load('client:auth2', function () {

				gapi.client.init({
					'apiKey': configuration.apiKey,
					'discoveryDocs': configuration.discoveryDocs,
					'clientId': configuration.clientId,
					'scope': configuration.scope
				}).then(function () {

					thiz.googleAuthInstance = gapi.auth2.getAuthInstance();

					// Listen for sign-in state changes.
					// The callback function must be a global named function
					thiz.googleAuthInstance.isSignedIn.listen(onUpdateGoogleSignInStatus);

					thiz.setSigninStatus();

				}).catch(function (error) {

					__callback(error);

				});

			}.bind(thiz));

		};

		/**
		 *
		 */
		this.element.onreadystatechange = function () {

			if (this.readyState === 'complete') {

				this.onload();

			}

		};

		/**
		 *
		 */
		this.setSigninStatus = function (isSignedIn) {

			if ((isSignedIn === true) || (isSignedIn === undefined)) {

				this.user = this.googleAuthInstance.currentUser.get();

				this.authorized = this.user.hasGrantedScopes(configuration.scope);

				this.authorizationToken = (this.authorized) ? this.user.getAuthResponse().access_token : null;

				if (!this.authorized) {

					this.googleAuthInstance.signIn().then(function (authenticatedUser) {

						__callback(this.user, this.authorized, this.authorizationToken);

					}.bind(this)).catch(function (error) {

						__callback(error);

					});

				} else {

					__callback(this.user, this.authorized, this.authorizationToken);

				}

			}

		};

		/**
		 *
		 */
		this.getAuthInstance = function () {

			return this.googleAuthInstance || null;

		};

		/**
		 *
		 */
		this.getUser = function () {

			return this.user || null;

		};

		/**
		 *
		 */
		this.getAuthorizationToken = function () {

			return this.authorizationToken;

		};

		/**
		 *
		 */
		this.hasGrantedScopes = function () {

			return this.authorized;

		};

		/**
		 *
		 */
		this.disconnect = function (deAuthenticate, callback) {

			if (this.googleAuthInstance.isSignedIn.get()) {

				if (deAuthenticate === true) {

					this.googleAuthInstance.disconnect().then(function () {

						if ((callback) && (callback instanceof Function)) {

							callback(true);

						}

					});

				} else {

					this.googleAuthInstance.signOut().then(function () {

						if ((callback) && (callback instanceof Function)) {

							callback(false);

						}

					});

				}

			}

		};

		/**
		 *
		 */
		 __window.onUpdateGoogleSignInStatus = function onUpdateGoogleSignInStatus (isSignedIn) {

			this.setSigninStatus(isSignedIn);

		}.bind(this);

		document.body.appendChild(this.element);

	};

	__window.Google = Google;

})(window);