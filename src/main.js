import React from 'react';
import ReactDOM from 'react-dom';


var PTT = {
	creds: Cookies.getJSON( '_ptt' ),
};

window.ptt = PTT;

// load our app
$( document).ready( function() {
	ReactDOM.render(
		<PTTLoad />,
		document.getElementById('app')
	);
});