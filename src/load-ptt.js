import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Load the app
 */
class PTTLoad extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			view: <LoadingIcon />,
		}
	}

	componentDidMount() {
		console.log(PTT);
		if ( window.ptt.auth && window.ptt.auth.authenticated() ) {
			console.log('authenticated');
			this.setState( {
				view: <Dashboard />,
			});
		}
		else if ( window.ptt.creds ) {
			console.log('not authenticated but we have creds.');
			discoverSite( window.ptt.creds );
		}
		else {
			console.log('not authenticated, no creds.');
			this.setState( {
				view: <Discover />,
			});
		}
	}

	render() {
		return (
			<div>
				{this.state.view}
			</div>
		);
	}
}