import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Displays and handles the form to discover the site and get the user signed in.
 * When finished, it loads the dashboard.
 */
class Discover extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
 			message: props.message || 'Let\'s find your site and get you authenticated. Use this url as the callback:',
 			processing: false,
 		};

		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
		e.preventDefault();

		// loading icon
		this.setState( {processing: true} );

		// get the data form the form
		const data = new FormData( e.target );

		// bild our credentials object
		const creds = {
			url:    data.get( 'site_url' ),
			key:    data.get( 'client_key' ),
			secret: data.get( 'client_secret' ),
		}

		// discover the site
		discoverSite( creds );
	}

	render() {
		const view = ( this.state.processing ) ? <LoadingIcon /> : this.theForm();
		return (
			<div className="discover_module">
				<div className="header">
					<h1>Premise Time Tracker</h1>
				</div>
				<div className="container">
					<div className="message">
						<p>{this.state.message}</p>
						<code>{window.location.href.replace( 'index.html', 'land.html' )}</code>
					</div>
					{view}
				</div>
			</div>
		);
	}

	// returns the form
	theForm() {
		return (
			<div className="discover_form">
				<form id="discover_form" onSubmit={this.handleSubmit}>
					<div>
						<label htmlFor="site_url">Site Url</label><br />
						<input 	type="url"
								name="site_url"
								id="site_url"
								defaultValue="http://time.vallgroup.com" />
					</div>
					<div>
						<label htmlFor="client_key">Client Key</label><br />
						<input 	type="text"
								name="client_key"
								id="key"
								defaultValue="YOpAWSAJwIVz" />
					</div>
					<div>
						<label htmlFor="client_secret">Client Secret</label><br />
						<input 	type="text"
								name="client_secret"
								id="secret"
								defaultValue="JZi4vlcL8vf2oDrtkYLmWCWb2NqHaP7Pm1r9mbdY8nGtlRyL" />
					</div>
					<PrimaryBtn />
				</form>
			</div>
		);
	}
}