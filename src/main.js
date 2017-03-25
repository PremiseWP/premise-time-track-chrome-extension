import React from 'react';
import ReactDOM from 'react-dom';

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
		const ptt = getPTT();

		console.log('begin fecth..')

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