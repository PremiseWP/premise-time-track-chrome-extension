import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Authenticate with the WP API and save the cookie for credentials used
 *
 * @param  {Object}   creds    the credentials to use for authentication
 * @param  {Function} callback A callback function to call after authentication.
 *                             Return the authentication object as 'this' argument
 * @return {void}              does not return anything. saves cookie and calls callback function.
 */
function authenticate( creds, callback ) {
	creds = creds || {};

	var _auth = {};

	if ( creds.api_url ) {
		// verify the site and get authorized.
		fetch( creds.api_url, {
			method: 'GET',
			mode: 'cors',
		})
		.then( resp => {
			resp.json()
			.then( site => {
				// save the site
				_auth.site = site;
				// get authorized and save the data
				_auth.auth = wpApiAuth( {
					oauth_consumer_key: creds.key,
					oauth_secret:       creds.secret,
					url:                creds.api_url,
					urls:               _auth.site.authentication.oauth1
				});

				Cookies.set( 'ptt_creds', creds );

				window.PTT = _auth;

				if ( callback && 'function' == typeof callback ) {
					callback.call( _auth );
				}
			});
		});
	}
}

/**
 * Display a loading icon
 */
class LoadingIcon extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			size: '3em',
			icon: 'fa-spinner',
			align: 'center',
		}
	}

	render() {
		const divStyle = {
			textAlign: this.state.align,
		}

		const iconStyle = {
			fontSize: this.state.size,
		};

		return (
			<div className="loading_icon" style={divStyle}>
				<i className={ 'fa fa-spin ' + this.state.icon } style={iconStyle}></i>
			</div>
		);
	}
}