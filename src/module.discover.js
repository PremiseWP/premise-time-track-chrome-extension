import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Discover View
 *
 * This view lets us discover the site that want to work with
 * and authenticate our user. When finished, it loads the dashboard.
 */
class Discover extends React.Component {
	constructor(props) {
		super(props);

 		this.state = { creds: {}, site: {}, auth: {} };

		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
		e.preventDefault();

		// get the data form the form
		let data = new FormData(e.target);

		// save our credentials
		this.state.creds = {
			url:    data.get( 'site_url' ),
			key:    data.get( 'client_key' ),
			secret: data.get( 'client_secret' ),
		}

		// needs to be cleaned up to check if url already has wp-json
		this.state.creds.api_url = this.state.creds.url + '/wp-json/';

		// authenticate, save cookie, and load dashboard.
		authenticate( this.state.creds, function() {
			var auth = this;
			ReactDOM.render(
				<Dashboard site={auth.site} />,
				document.getElementById('app')
			);
		} );
	}

	render() {
		return (
			<div>
				<form onSubmit={this.handleSubmit}>
					<div>
						<label htmlFor="site_url">Site Url</label><br />
						<input type="url" name="site_url" id="site_url" defaultValue="http://time.vallgroup.com" />
					</div>
					<div>
						<label htmlFor="client_key">Client Key</label><br />
						<input type="text" name="client_key" id="key" defaultValue="zyzSVcThUzvr" />
					</div>
					<div>
						<label htmlFor="client_secret">Client Secret</label><br />
						<input type="text" name="client_secret" id="secret" defaultValue="kvdxdEEZjIsJfM6fZOHhbC0etrPBVXvotfoh0JiCzBCHhgSN" />
					</div>
					<input type="submit" />
				</form>
			</div>
		);
	}
}