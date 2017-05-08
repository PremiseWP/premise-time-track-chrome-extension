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
			formURL: PTT.site.url + '/wp-json/wp/v2/premise_time_tracker'
		}

		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
		e.preventDefault();

		var _form = e.target,
		fields    = $(_form).serializeArray(),
		url       = _form.action,
		parser    = '',
		query;

		console.log(fields);
		// build query
		for (var i = fields.length - 1; i >= 0; i--) {
			if ( fields[i].value.length ) {
				parser += '&' + fields[i].name + '=' + fields[i].value;
			}
		}
		query = url + '?' + parser.substr(1, parser.length);
console.log(query);
		$.ajax( {
			beforeSend: PTT.auth.ajaxBeforeSend,
			method: 'POST',
			url: query,
		}).done( function( response ) {
			console.log(response)
		});

	}

	render() {
		return (
			<div className="dashboard_box new_timer_form">
				<div className="dashboard_box_header">
					<h3>New Timer</h3>
				 </div>
			 	<div className="dashboard_box_content">
					<form action={this.state.formURL}
						  method="post"
						  onSubmit={this.handleSubmit}>

						<input 	type="hidden"
								name="status"
								value="publish" />

						<div className="pwp-row not-responsive">
							<div className="col2 premise-field">
								<label htmlFor="title">Title</label><br />
								<input type="text" name="title" id="title" />
							</div>
							<div className="col2 premise-field">
								<label htmlFor="pwptt_hours">Time</label><br />
								<input type="number" name="pwptt_hours" id="pwptt_hours" />
							</div>
							<div className="span12 premise-field">
								<label htmlFor="content">Description</label><br />
								<textarea name="content" id="content" />
							</div>
						</div>
						<div className="primary_btn pwp-align-center">
							<input className="pwp-display-block" type="submit" />
						</div>
					</form>
				</div>
			</div>
		);
	}
}