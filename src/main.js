import React from 'react';
import ReactDOM from 'react-dom';

// var WPAPI = require( 'wpapi' );

$(document).ready( function() {
	// Load it! when document is ready
	ReactDOM.render(
		<LoadPTT />,
		document.getElementById('app')
	);
});

/**
 * Load the timer dashboard or discover view.
 *
 * if the creds are saved in a cookie it attempts to load the dashboard using those credentials.
 * Otherwise, it loads the Discover view to begin authentication.
 */
class LoadPTT extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			creds: Cookies.getJSON( 'ptt_creds' ) || {},
			view: <LoadingIcon />,
		}
	}

	componentDidMount() {
		if ( Object.keys( this.state.creds ).length > 0 ) {

			var _this = this;
			authenticate( this.state.creds, function() {
				_this.setState( {view: <Dashboard site={this.site}/> } );
			} );
		}
		else {
			this.setState( {
				view: <Discover />
			} );
		}
	}

	render() {
		return (
			<div>
				{this.state.view}
			</div>
		);
	}
};