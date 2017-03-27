import React from 'react';
import ReactDOM from 'react-dom';

// get the stored object in JSON format along with the url for client
class PTT extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			ptt: this.getStored(),
			url: ''
		}
	}

	render() {
		return ();
	}

	getStored() {
		if ( localStorage.getItem( 'ptt' ) ) {
			// Get!
			return JSON.parse( localStorage.getItem( ptt ) );
		} else {
			// New!
			return {};
		}
	}

	setStored( object ) {
		localStorage.setItem( 'ptt', JSON.stringify( object ) );
	}

	ptt = getStoredObject( 'ptt' );

	console.log( ptt );

	phpClientUrl  = 'http://ptt.client';

	if ( Object.keys( ptt ).length > 1 ) {

		// PTT API saved, get it.
		phpClientUrl += '?site_base=' + encodeURIComponent( ptt.site_base ) +
			'&client_key=' + encodeURIComponent( ptt.client_key ) +
			'&client_secret=' + encodeURIComponent( ptt.client_secret ) +
			'&token_credentials=' + encodeURIComponent( ptt.token_credentials ); // ?site_base=http%3A%2F%2Flocalhost%2Ftest%2Fpremisesplitview%2F&client_key=I9aT2lBzYE2n&client_secret=0WwKpqHwgoVOgwwI7HgyjdAItd4DLZd8wEIQ2R6eRp0Lvqd8&token_credentials=O%3A49%3A%22League%5COAuth1%5CClient%5CCredentials%5CTokenCredentials%22%3A2%3A%7Bs%3A13%3A%22%00%2A%00identifier%22%3Bs%3A24%3A%229xMnHuPSmJrLKaWlyEDBytRu%22%3Bs%3A9%3A%22%00%2A%00secret%22%3Bs%3A48%3A%22z66bCzlBQX9smdjsx3ROS89ltMq7UZaej6YJ56dC3FmiZDbg%22%3B%7D
	}
	return {
		stored: ptt,
		url: phpClientUrl
	};
};

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
ReactDOM.render(
	<NewTimerBtn />,
	document.getElementById('dashboard')
);

// output posts
ReactDOM.render(
	<LoadTimers />,
	document.getElementById('root')
);