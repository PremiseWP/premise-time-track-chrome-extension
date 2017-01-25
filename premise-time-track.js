/**
 * Premise Time Track Chrome Extension Javascripts.
 */

// Global vars.
var ptt,
	tabID,
	phpClientUrl = 'http://tt-wp-api.vallgroup.com/premise-time-track-client'; // Without trailing slash!
	// phpClientUrl = 'http://localhost:8080'; // Without trailing slash!

// Init on load.
window.onload = init;

function getStoredObject( objectName ) {
	if ( objectName &&
		localStorage.getItem( objectName ) ) {
		// Get!
		return JSON.parse( localStorage.getItem( objectName ) );
	} else {
		// New!
		return {};
	}
}

function setStoredObject( objectName, object ) {
	// Set!
	localStorage.setItem( objectName, JSON.stringify( object ) );
}

function init() {

	ptt = getStoredObject( 'ptt' );

	console.log( ptt );

	var url = phpClientUrl;

	if ( Object.keys( ptt ).length > 1 ) {

		// PTT API saved, get it.
		url += '?site_base=' + encodeURIComponent( ptt.site_base ) +
			'&client_key=' + encodeURIComponent( ptt.client_key ) +
			'&client_secret=' + encodeURIComponent( ptt.client_secret ) +
			'&token_credentials=' + encodeURIComponent( ptt.token_credentials ); // ?site_base=http%3A%2F%2Flocalhost%2Ftest%2Fpremisesplitview%2F&client_key=I9aT2lBzYE2n&client_secret=0WwKpqHwgoVOgwwI7HgyjdAItd4DLZd8wEIQ2R6eRp0Lvqd8&token_credentials=O%3A49%3A%22League%5COAuth1%5CClient%5CCredentials%5CTokenCredentials%22%3A2%3A%7Bs%3A13%3A%22%00%2A%00identifier%22%3Bs%3A24%3A%229xMnHuPSmJrLKaWlyEDBytRu%22%3Bs%3A9%3A%22%00%2A%00secret%22%3Bs%3A48%3A%22z66bCzlBQX9smdjsx3ROS89ltMq7UZaej6YJ56dC3FmiZDbg%22%3B%7D
	} else if ( ! ptt.auth_tab ||
			document.URL.indexOf( 'auth-tab' ) < 0 ) {

		// Move authorization process to new tab!
		chrome.tabs.create({url: document.URL + '?auth-tab=1'}, function(tab){
			ptt.auth_tab = tab.id;
			console.log(ptt.auth_tab);
			setStoredObject( 'ptt', ptt );
		});

		return;
	} else if ( document.URL.indexOf( 'auth-tab' ) > 0 ) {

		$('body').addClass('auth-tab');
	}

	// Add spinner while iframe is loading: NOT WORKING...
	document.body.innerHTML = '<div class="loading-spinner"><img src="icon.png" /></div>';

	window.setTimeout(launchIframe( url ), 1000);

}


function launchIframe( url ) {
	// Launch Iframe.
	document.body.innerHTML += '<iframe src="' + url + '" id="ptt-iframe"></iframe>';

	var removeLoadingSpinner = function () {

		$('.loading-spinner').remove();

		// Remove callback.
		callbacks.remove( removeLoadingSpinner );
	};

	// Remove spinner.
	$('#ptt-iframe').load(removeLoadingSpinner);

	if ( Object.keys( ptt ).length < 2 ) {

		var iframe = document.getElementById('ptt-iframe');

		// PTT API retrieving system using message.
		// http://stackoverflow.com/questions/25098021/securityerror-blocked-a-frame-with-origin-from-accessing-a-cross-origin-frame#25098153
		$('#ptt-iframe').load(function(){
			console.log('ptt-iframe (re)loaded');

			// When the iframe has fully loaded, if not blocked by a iframe blocker:

			// This will successfully queue a message to be sent to the iframe, assuming
			// the window hasn't changed its location.
			this.contentWindow.postMessage("ptt", '*');

			window.addEventListener("message", receiveMessage, false);
		});

	}
}

function receiveMessage(event) {
	console.log(event.origin);
	// Do we trust the sender of this message?  (might be
	// different from what we originally opened, for example).
	if (phpClientUrl.indexOf(event.origin) !== 0)
		return;

	var tabID = ptt.auth_tab;

	// event.source is iframe
	// event.data is "hi there yourself!  the secret response is: rheeeeet!"
	// console.log(event.data);
	ptt = event.data;

	localStorage.setItem( 'ptt', ptt );

	alert('You have successfully been authenticated! Please open the extension again.');

	// Close tab!
	chrome.tabs.remove( tabID, function() {

		// Open popup? You can't...
		// http://stackoverflow.com/questions/10479679/how-can-i-open-my-extensions-pop-up-with-javascript
	});
}


// 'X-Frame-Options' set to 'SAMEORIGIN' on wp-login.php workaround.
// http://stackoverflow.com/questions/15532791/getting-around-x-frame-options-deny-in-a-chrome-extension#15534822
chrome.webRequest.onHeadersReceived.addListener(
	function(info) {
		var headers = info.responseHeaders;
		for (var i=headers.length-1; i>=0; --i) {
			var header = headers[i].name.toLowerCase();
			if (header == 'x-frame-options' || header == 'frame-options') {
				headers.splice(i, 1); // Remove header
			}
		}
		return {responseHeaders: headers};
	},
	{
		urls: [ '*://*/*' ], // Pattern to match all http(s) pages
		types: [ 'sub_frame' ]
	},
	['blocking', 'responseHeaders']
);
