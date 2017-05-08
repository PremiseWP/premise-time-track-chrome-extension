import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Authenticates our user and saves the site
 * info as a cookie in our browser.
 *
 * @param  {Object} creds the credentials to authenticate user
 * @return {void}
 */
function discoverSite( creds ) {
	creds = creds || null;

	if ( ! creds ) {
		console.error( 'No URL supplied to discover site.' );
		return false;
	}

	fetch( creds.url + '/wp-json/' )
	.then( r => {
		r.json()
		.then( s => {
			// save the site info
			PTT.site = s;

			// save the
			PTT.auth = wpApiAuth( {
				oauth_consumer_key: creds.key,
				oauth_secret:       creds.secret,
				url:                creds.api_url,
				urls:               s.authentication.oauth1,
			});

			PTT.auth.authenticate( function( err, oauth ) {
				var view;
				// handle errors first
				if ( err ) {
					view = <Discover message={err.responseText} />;
				}
				// No errors! sho the dashboard
				else {
					view = <Dashboard />;
					Cookies.set( '_ptt', creds );
				}

				ReactDOM.render(
					view,
					document.getElementById('app')
				);
			});
		});
	});
}

/**
 * Display a loading icon
 */
class LoadingIcon extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			size: '3em',
			icon: 'fa-spinner',
			align: 'center',
		}
	}

	render() {
		const divStyle = {
			textAlign: this.state.align,
		}

		const iconStyle = {
			fontSize: this.state.size,
		};

		return (
			<div className="loading_icon" style={divStyle}>
				<i 	className={ 'fa fa-spin ' + this.state.icon }
					style={iconStyle}></i>
			</div>
		);
	}
}

/**
 * Output a dashboard box - in bet does not work when updatin state
 */
class DashboardBox extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			title:   props.title   || '',
			classes: props.classes || '',
			content: props.children || '',
		}

		this.toggleBoxContent = this.toggleBoxContent.bind(this);
	}

	// toggle box content
	toggleBoxContent(e) {
		e.preventDefault();
		$(e.target).parents( '.dashboard_box' )
			.find( '.dashboard_box_content' )
			.slideToggle( 'fast' );
		return false;
	}

	render() {
		console.log( this.state.content );
		return (
			<div id={this.state.title.toLowerCase()}
				 className={'dashboard_box' + this.state.classes}>
				<div className="dashboard_box_header">
					<a 	href="#"
						className="dashboard_close_box"
						onClick={this.toggleBoxContent}>
						<i className="fa fa-caret-up" />
					</a>
				 	<h3>{this.state.title}</h3>
				 </div>
			 	<div className="dashboard_box_content">
					{this.state.content}
				</div>
			</div>
		);
	}
}