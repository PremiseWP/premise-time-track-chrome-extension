import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Display the new timer button
 */
class NewTimer extends React.Component {
	constructor(props) {
		super(props);

		this.handleClick = this.handleClick.bind(this);

		this.state = {
			view: '',
		};

	}

	handleClick(e) {
		e.preventDefault();

		this.setState( {
			view: <NewTimerForm />,
		} );
	}

	render() {
		if ( '' == this.state.view ) {
			this.state.view = <button id="new_timer_btn" className="start_timer" onClick={this.handleClick} title="New Timer">
				<i className="fa fa-clock-o" />
			</button>;
		}

		return (
			<div id="new_timer">
				{this.state.view}
			</div>
		);
	}
}

/**
 *
 */
class NewTimerForm extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			creds: Cookies.getJSON( 'ptt_creds' )
		}

		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
		e.preventDefault();

		console.log( e.target.action );
		// get the data form the form
		let data = new FormData(e.target);

		let options = {
			url: e.target.action,
			method: e.target.method,
		}

		var headers = new Headers();

		// headers.append( 'Authorize', window.PTT.auth.serialize() );

		fetch( e.target.action, {
			method: e.target.method,
			headers: headers,
			data: data,
		} )
		.then( r => {
			console.log( r );
		});
	}

	render() {
		return (
			<div>
				<form action={this.state.creds.api_url + 'wp/v2/premise_time_tracker'} method="post" onSubmit={this.handleSubmit}>
					<div>
						<label htmlFor="title">Title</label><br />
						<input type="text" name="title" id="title" />
					</div>
					<div>
						<label htmlFor="pwptt_hours">Time</label><br />
						<input type="number" name="pwptt_hours" id="pwptt_hours" />
					</div>
					<input type="submit" />
				</form>
			</div>
		);
	}
}