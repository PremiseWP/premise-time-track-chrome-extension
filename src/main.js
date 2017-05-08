import React from 'react';
import ReactDOM from 'react-dom';

var PTT = {
	creds: Cookies.getJSON( '_ptt' ),
};

window.ptt = PTT;

ReactDOM.render(
	<LoadingIcon />,
	document.getElementById('app')
);

// Load our app when document is ready
$(document).ready( function() {

	if ( PTT.creds ) {
		discoverSite( PTT.creds );
	}

	else {
		ReactDOM.render(
			<Discover />,
			document.getElementById('app')
		);
	}
});