import React from 'react';
import ReactDOM from 'react-dom';

class NewTimerBtn extends React.Component {
	constructor(props) {
		super(props);
		this.state = {text: 'New Timer'}
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		const form = <NewTimerForm />;
		ReactDOM.render(
			<IntoApp><NewTimerForm /></IntoApp>,
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

class MyTimeBtn extends React.Component {
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

class NewTimerForm extends React.Component {
	render() {
		return (
			<form>
			<div>
				<input type="text" name="title" />
			</div>
			<div>
			<textarea name="content"></textarea>
			</div>
			<div>
				<input type="date" name="post-date" />
			</div>
			<div>
				<input type="number" name="ptt-time" min="0" step="0.25" placeholder="1.75" />
			</div>
			<div>
				<input type="submit" value="submit" />
			</div>
			</form>
		);
	}
}

ReactDOM.render(
	<NewTimerBtn />,
	document.getElementById('dashboard')
);

ReactDOM.render(
	<MyTimeBtn />,
	document.getElementById('dashboard')
);


function IntoApp(props) {
	const _class = props.className || '';
	return (
		<div className={'app-inner ' + _class }>
			{props.children}
		</div>
	);
}