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
 			message: props.message || 'Let\'s find your site and get you authenticated.',
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

		for ( var i in creds ) {
			if ( creds.hasOwnProperty( i ) ) {
				if ( ! creds[i].length ) {
					this.setState( {
						message: <span className="error">None of the fields can be empty.</span>,
						processing: false,
					});
					return false;
				}
			}
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
						Use this as your callback:
						<pre>
							<code>{window.location.href + 'land.html'}</code>
						</pre>
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
								id="site_url" />
					</div>
					<div>
						<label htmlFor="client_key">Client Key</label><br />
						<input 	type="text"
								name="client_key"
								id="key" />
					</div>
					<div>
						<label htmlFor="client_secret">Client Secret</label><br />
						<input 	type="text"
								name="client_secret"
								id="secret" />
					</div>
					<PrimaryBtn />
				</form>
			</div>
		);
	}
}