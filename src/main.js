import React from 'react';
import ReactDOM from 'react-dom';

class DiscoverSite extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			onSubmit: props.onSubmit
		};
	}

	render() {
		return (
			<div>
				<form onSubmit={this.state.onSubmit}>
					<input type="hidden" value="discover" name="step" id="step" />
					<input type="url" name="uri" id="uri" defaultValue="http://time.vallgroup.com" />
					<br />
					<input type="submit" />
				</form>
			</div>
		);
	}
}

class DiscoverCredentials extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			onSubmit: props.onSubmit,
			siteBase: props.siteBase,
			siteAuthUrls: props.siteAuthUrls
		};
	}

	render() {
		return (
			<div>
				<form action="http://ptt.client" method="GET" onSubmit={this.state.onSubmit}>
					<input type="hidden" value="preauth" name="step" id="step" />
					<input type="hidden" value={this.state.siteBase} name="site_base" id="site_base" />
					<input type="hidden" value={JSON.stringify(this.state.siteAuthUrls)} name="site_auth_urls" id="site_auth_urls" />
					<input type="hidden" value={window.location} name="site_referrer" id="site_referrer" />
					<input type="text" name="client_key" id="key" defaultValue="zyzSVcThUzvr" /><br />
					<input type="text" name="client_secret" id="secret" defaultValue="kvdxdEEZjIsJfM6fZOHhbC0etrPBVXvotfoh0JiCzBCHhgSN" />
					<input type="submit" />
				</form>
			</div>
		);
	}
}

/**
 * Get stored object
 */
class Discover extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			site: {},
			oAuth: {},
			url: ''
		}

		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
		e.preventDefault();

		// get the data form the form
		let data = new FormData(e.target);

		// build the url based on the data passed by the form
		let _url = 'http://ptt.client?';
		// https://developer.mozilla.org/en-US/docs/Web/API/FormData/entries
		for ( var pair of data.entries() ) {
			_url += '&' + pair[0] + '=' + encodeURIComponent( pair[1] );
		}
		console.log( _url );

		if ( 'discover' === data.get( 'step' ) ) {
			// AJAX call the get credentials
			fetch( _url, {
				method: 'GET',
				mode: 'cors',
			})
			.then( r => {
					r.json()
					.then( t => {
							this.setState({site: t});
					});
			});
		}
		else {
			// window.open(_url,'_blank');
			document.getElementById('app').innerHTML = '<iframe src="'+_url+'" height="400" width="320"></iframe>';
			// , function(tab){
			// 	ptt.auth_tab = tab.id;
			// 	// console.log(ptt.auth_tab);
			// 	setStoredObject( 'ptt', ptt );
			// }
		}

	}

	// handleSubmit(e) {
	// 	const uri = document.getElementById( 'uri' ).value;

	// 	console.log( uri );

	// 	fetch( 'http://ptt.client?step=discover&uri='+uri, {
	// 		method: 'GET',
	// 		mode: 'cors',
	// 	})
	// 	.then( r => {
	// 		return r.json()
	// 	})
	// 	.then( t => {
	// 		o.append( t )
	// 		console.log(o)
	// 	});

	// 	e.preventDefault();
	// }

	render() {
		const fields = ( 'undefined' !== typeof this.state.site.site_base )
			? <DiscoverCredentials siteBase={this.state.site.site_base} siteAuthUrls={this.state.site.site_auth_urls} onSubmit={this.handleSubmit} />
			: <DiscoverSite onSubmit={this.handleSubmit} />;

		return (
			<div>
				{fields}
				<div>
					<pre>Site: {JSON.stringify(this.state)}</pre>
				</div>
			</div>
		);
	}
}

class Dashboard extends React.Component {
	constructor(props) {
		super(props);

	}

	render() {
		return (
			<div>
				Dashboard
			</div>
		);
	}
}

// get the stored object in JSON format along with the url for client
class PTT extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			ptt: getStoredPtt(),
			url: ''
		}
	}

	componentDidMount() {
		let view = ( ! Object.keys( this.state.ptt ).length > 0 )
			? <Discover />
			: <Dashboard />;

		ReactDOM.render(
			view,
			document.getElementById('app')
		);
	}

	render() {
		return (
			<div>
				<p>Soterd Object: {JSON.stringify(this.state.ptt)}</p>
				<p>URL: {this.state.url}</p>
			</div>
		);
	}

	buildUrl() {
		// if ( Object.keys( this.state.ptt ).length > 1 ) {
			/*const url = 'http://ptt.client';
			url + '?site_base='         + encodeURIComponent( ptt.site_base ) +
					'&client_key='        + encodeURIComponent( ptt.client_key ) +
					'&client_secret='     + encodeURIComponent( ptt.client_secret ) +
					'&token_credentials=' + encodeURIComponent( ptt.token_credentials );*/
			const url = 'http://ptt.client?step=ptt-details' +
			    '&site_base=' + encodeURIComponent( 'http://time.vallgroup.com/wp-json/' ) +
				'&client_key=' + encodeURIComponent( 'zyzSVcThUzvr' ) +
				'&client_secret=' + encodeURIComponent( 'kvdxdEEZjIsJfM6fZOHhbC0etrPBVXvotfoh0JiCzBCHhgSN' ) +
				'&token_credentials=' + encodeURIComponent( 'O:49:"League\OAuth1\Client\Credentials\TokenCredentials":2:{s:13:"*identifier";s:24:"oAXrp4Rzhie5wrwzVEQs2W0Q";s:9:"*secret";s:48:"e0L1WqHiGZSWhalqVFK1AENtYqxc8hYEVHvpuXrB8z56msWO";}' );
			return url; //this.setState({url: url});
		// }
	}
};
// Init
ReactDOM.render(
	<PTT />,
	document.getElementById('root')
);


/*
	Helpers
 */

function getStoredPtt() {
	if ( localStorage.getItem( 'ptt' ) ) {
		// Get!
		return JSON.parse( localStorage.getItem( 'ptt' ) );
	} else {
		// New!
		return {};
	}
}

function setStoredPtt( object ) {
	localStorage.setItem( 'ptt', JSON.stringify( object ) );
	console.log('PTT has been store locally:');
	console.log(getStoredPtt());
}


/**
 * New timer button
 *
 * Dsiplays the new timer button and handles click event
 */
class NewTimerBtn extends React.Component {
	constructor(props) {
		super(props);
		this.state = {text: 'New Timer'}

		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		ReactDOM.render(
			<NewTimerForm />,
			document.getElementById('app')
		);
	}

	render() {
		return (
			<button onClick={this.handleClick}>
				{this.state.text}
			</button>
		);
	}
}

/**
 * New timer form
 *
 * This form handles creating and editing timers.
 */
class NewTimerForm extends React.Component {
	constructor(props) {
		super(props);

		this.state = {};

		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
		console.log(e.target.action);

		fetch( e.target.action )
			.then( r =>
				console.log( r )
			);
		e.preventDefault();
	}

	render() {
		return (
			<form action="http://ptt.client?step=ptt-save" method="post" onSubmit={this.handleSubmit}>
				<div className="hidden-fields">
					<input type="hidden" name="ptt-id" value="" />
				</div>
				<div>
					<input type="text" name="ptt[title]" />
				</div>
				<div>
				<textarea name="ptt[content]"></textarea>
				</div>
				<div>
					<input type="date" name="ptt[date]" />
				</div>
				<div>
					<input type="number" name="ptt[pwptt_hours]" min="0" step="0.25" placeholder="1.75" />
				</div>
				<div>
					<input type="submit" value="submit" />
				</div>
			</form>
		);
	}
}


class LoadTimers extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			title: 'Loading...',
			query: {
				posts: [],
				taxonomies: {}
			}
		};

		this.handleClick = this.handleClick.bind(this);
	}

	componentDidMount() {
		console.log(ptt)

		let _this = this;
		fetch( ptt.url )
			.then( (r) => {
				// this is a promise. Set state once pormise has settled
				r.json().then( (json) => {
					console.log(json);
					this.setState({title: 'Loaded', query: json});
				});
			});

	}

	handleClick() {
		// handle
	}

	render() {
		// Iterate through the posts, build list
		const listPosts = this.state.query.posts.map( (p) =>
			<li key={p.id}>{p.title.rendered}</li>
		);
		return (
			<div>
				<h3>{this.state.title}</h3>
				<ul>
					{listPosts}
				</ul>
				Count: {this.state.query.posts.length}
			</div>
		);
	}
}

// output the dashboard
// ReactDOM.render(
// 	<NewTimerBtn />,
// 	document.getElementById('dashboard')
// );