import React from 'react';
import ReactDOM from 'react-dom';



/**
 * Display the new timer button
 */
class NewTimer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {};

		this.state.post = Cookies.getJSON( 'ptt_current_timer' );

		this.state.message = ( this.state.post )
				? this.timerStartedMessage( new Date( this.state.post.start ) )
				: '';

		this.state.view = ( this.state.post )
				? <StopTimerBtn post={this.state.post.id}
								onClick={this.handleStopTimer.bind(this)} />
				: <NewTimerBtn onClick={this.handleNewTimer.bind(this)} />;

		// bind events
		this.handleNewTimer  = this.handleNewTimer.bind(this);
		this.handleStopTimer = this.handleStopTimer.bind(this);
	}

	componentDidMount() {

	}

	// TODO handle error
	handleNewTimer(e) {
		e.preventDefault();

		var _this = this;

		// start the timer!
		const _start = new Date();

		$.ajax( {
			beforeSend: PTT.auth.ajaxBeforeSend,
			method: 'POST', // create a post. 'GET' retrieves them
			url: pttEndpoint()
				+ '?status=publish&title=Timer in progress create by PTT at '
				+ _start.toLocaleTimeString(),
		})
		.done( function( post ) {
			// save post info in a cookie.
			Cookies.remove( 'ptt_current_timer' );
			Cookies.set( 'ptt_current_timer', {
				id: post.id,
				start: _start.getTime(),
			} );

			console.log(post);

			_this.setState( {
				post: {
					id: post.id,
					start: _start.getTime(),
				},
				view: <StopTimerBtn post={post.id}
						onClick={_this.handleStopTimer.bind(_this)} />,
				message: _this.timerStartedMessage( _start ),
			});
		})
		.fail( function( err ) {
			console.log( err );
			_this.setState( {
				message: <span className="error">There was an error</span>
				// TODO test err.responseText();
			});
		});
	}

	handleStopTimer(e) {
		e.preventDefault();

		const stop     = new Date();
		const diff     = Math.abs( stop.getTime() - this.state.post.start );
		const minutes  = Math.floor( diff / 60000 );
		const total    = parseFloat( minutes / 60 );
		const time     = ( Math.round(total * 4) / 4).toFixed(2);

		this.setState( {
			view: <NewTimerForm post={this.state.post.id} total={time} />,
			message: 'Congratulations, you finished a task! Enter some information about it here to complete recording your time.',
		});
	}

	timerStartedMessage( _date ) {
		const time = _date.toLocaleTimeString();
		return (
			<span>
				Timer started at:
				<span className="time"> {time}</span>.<br />
				Time is ticking..
			</span>
		);
	}

	render() {
		return (
			<div id="new_timer">
				<div className="message">{this.state.message}</div>
				{this.state.view}
			</div>
		);
	}
}

class NewTimerBtn extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			onClick: props.onClick,
		}
	}

	render() {
		return (
			<div className="new_timer_btn">
				<button id="new_timer_btn"
					title="New Timer"
					onClick={this.state.onClick}>
					{timerSVG()}
				</button>
			</div>
		);
	}
}

class StopTimerBtn extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			onClick: props.onClick,
		}

	}

	render() {
		return (
			<div className="stop_timer_btn">
				<button id="stop_timer_btn"
					title="Stop Timer"
					onClick={this.state.onClick}>
					{timerSVG()}
				</button>
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
			view:     'show',
			loading: '',
			post:     null, // the current post we are wokring with
			projects: <LoadingIcon />,
			clients:  <LoadingIcon />,
			form: {
				action: pttEndpoint(),
				status: 'publish',
				id:   props.post  || '',
				time: props.total || '',
				title: '',
				content: '',
				client: '',
				project: '',
			}
		}

		// bind submit event
		this.handleSubmit = this.handleSubmit.bind(this);
		this.loadClients = this.loadClients.bind(this);
		this.loadProjects = this.loadProjects.bind(this);
		this.updateFieldValue = this.updateFieldValue.bind(this);
	}

	render() {
		return (
			<div className="new_timer_form">
				{this.state.loading}
				<form className={this.state.view}
					  action={this.state.form.action}
					  method="post"
					  onSubmit={this.handleSubmit}>

					<input 	type="hidden"
							name="status"
							value={this.state.form.status} />

					<input 	type="hidden"
							name="id"
							value={this.state.form.id} />

					<div className="basic_fields">
						<div className="premise-field">
							<label htmlFor="pwptt_hours">Time</label><br />
							<input type="text" name="pwptt_hours" id="pwptt_hours"  defaultValue={this.state.form.time} />
						</div>
						<div className="premise-field">
							<label htmlFor="title">Title</label><br />
							<input type="text" name="title" id="title"
								value={this.state.form.title}
								onChange={this.updateFieldValue} />
						</div>
						<div className="span12 premise-field">
							<label htmlFor="content">Description</label><br />
							<textarea name="content" id="content"
								value={this.state.form.content}
								onChange={this.updateFieldValue}  />
						</div>
					</div>

				    <div className="clients">
						<h3>Clients</h3>
					        {this.state.clients}
					</div>

					<div className="projects">
						<h3>Projects</h3>
						{this.state.projects}
					</div>

					<PrimaryBtn />
				</form>
			</div>
		);
	}

	componentDidMount() {
		// if we have a form id, the lets get the post before loading the form
		if ( this.state.form.id ) {
			// get the post and save it
			this.state.post = getPost( this.state.form.id );
			this.state.post.then( _p => {
				// build form before showing it
				const buildForm = Object.assign( this.state.form, {
					title:       _p.title.rendered,
					content: _p.content.rendered,
					client: ( _p.premise_time_tracker_client.length )
							? _p.premise_time_tracker_client.split(',')
							: '',
					project: ( _p.premise_time_tracker_project.length )
							 ? _p.premise_time_tracker_project.split(',')
							 : '',
				} )
				this.setState( {
					form: buildForm,
				});
				console.log('form should be built');
			} );
		}

		this.loadClients();
		this.loadProjects();
	}

	updateFieldValue(e) {
		var newState = {};
		newState[e.target.name] = e.target.value;
		this.setState({
			form: Object.assign( this.state.form, newState ),
		});
	}

	handleSubmit(e) {
		e.preventDefault();

		$('body').animate({scrollTop: 0}, 400);

		// reference 'this' and show the loading icon
		let _this = this;
		_this.setState( {
			loading: <LoadingIcon />,
			view: 'hide',
		});

		var fields = $(e.target).serializeArray(),
		query      = e.target.action,
		parser     = '',
		id;
		// parse fields
		for (var i = fields.length - 1; i >= 0; i--) {
			// exclude id or empty values
			if ( 'id' !== fields[i].name
				 && fields[i].value.length ) {
				parser += '&' + fields[i].name + '=' + fields[i].value;
			}
			// save the id separately
			else {
				id = fields[i].value;
			}
		}
		// build the query
		query += '/' + id + '?' + parser.substr(1, parser.length);

		// save our timer
		$.ajax( {
			url: query,
			method: 'POST',
			beforeSend: PTT.auth.ajaxBeforeSend,
		}).done( function( response ) {
			// we were successful!
			console.log(response);
			// delete post cookie
			Cookies.remove( 'ptt_current_timer' );
			// reload because we cannot update the view.
			// TODO fix this!
			location.reload();
		}).fail( function( err ) {
			console.error( err );
			_this.setState( {
				message: <span className="error">There was an error</span>
				// TODO test err.responseText();
			});
		});
	}

	listTax( terms ) {

		let list = [];
		for (var i = terms.length - 1; i >= 0; i--) {
			list.push(
				<li key={terms[i].id} className="taxonomy_field">
					<label htmlFor={terms[i].taxonomy + '_' + terms[i].id}>
						<input 	type="radio"
								name={terms[i].taxonomy}
								value={terms[i].id}
								id={terms[i].taxonomy + '_' + terms[i].id} />
						<span>{terms[i].name}</span>
					</label>
				</li>
			);
		}

		const ul = <ul>
			{list}
		</ul>;
		return ul;
	}

	theForm( _form ) {
		// this.state.form = Object.assign( this.state.form, _form );
		// return(

		// );
	}

	loadClients() {
		console.log('loading clients');
		getTax( 'client' ).then( clients => {
			this.state.clients = this.listTax( clients );
			this.setState({
				// clients: list,
				view: this.theForm(),
			});
		});
	}

	loadProjects() {
		console.log('loading projects');
		getTax( 'project' ).then( projects => {
			this.setState({
				projects: this.listTax( projects ),
			});
		});
	}
}