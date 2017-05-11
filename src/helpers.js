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
				// singlepage: true,
			});

			PTT.auth.authenticate( function( err, oauth ) {
				var view;
				// handle errors first
				if ( err ) {
					const errMsg = <span className="error">{err.responseText}</span>
					view = <Discover message={errMsg} />;
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
 * Retrieve a taxonomy from premise time tracker
 *
 * @param  {String}   slug     the taxonomy slug (wihtout 'premise_time_tracker_')
 * @param  {Function} callback a callback to be called with the taxonomy found
 * @return {Void}              does not return anything. call the callbcak passed.
 */
function loadTax( slug, callback ) {
	slug = slug || null;

	if ( ! slug ) return false;

	fetch( PTT.site.url + '/wp-json/wp/v2/premise_time_tracker_' + slug + '/' )
	.then( response => {
		response.json()
		.then( _terms => {
			callback( _terms );
		});
	});
}

/**
 * Retrieve a taxonomy from premise time tracker
 *
 * @param  {String} slug the taxonomy slug (wihtout 'premise_time_tracker_')
 * @return {Promise}     Promise for the taxonomy object
 */
function getTax( slug ) {
	slug = slug || null;

	if ( ! slug ) return false;

	var _url = PTT.site.url + '/wp-json/wp/v2/premise_time_tracker_' + slug + '/',

	tax = fetch( _url )
	.then( response => {
		return response.json();
	});
	return tax;
}

/**
 * retrieve a post from premise time tracker
 *
 * @param  {Integer} id      the id for the post we want to retrieve
 * @param  {Object}  options params to add to the query as a javascript object
 * @return {Object}          the post object for the post found.
 */
function getPost( id, options ) {
	id = id || null;
	options = options || null;

	if ( ! id ) return false;

	// parse options as params
	// BETA not fully tested
	if ( options ) {
		var _options = '';
		for ( var i in options ) {
			if ( options.hasOwnProperty( i ) ) {
				_options += '&' + i + '=' + options[i];
			}
		}
		// console.log(_options);
	}

	// fetch the post and return promise
	var tax = fetch( pttEndpoint() + '/' + id + '?' + _options + '/' )
	.then( response => {
		return response.json();
	});
	return tax;
}

/**
 * The main endpoint for the premise time tracker post type
 *
 * @return {string} the url for our main endpoint
 */
function pttEndpoint() {
	return PTT.site.url + '/wp-json/wp/v2/premise_time_tracker';
}

/**
 * Returns the svg element for the timer compatible with JSX syntax
 *
 * @return {string} HTML for timer SVG
 */
function timerSVG() {
	return (
		<svg viewBox="0 0 352 401" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
		    <g id="timer_svg" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
		        <path d="M121.606,0 C117.712,0 114.647,3.1064 114.647,6.9584 C114.647,10.8522 117.754,13.9972 121.606,13.9972 L139.001,13.9972 L139.001,52.672 C59.631,69.573 -2.84217094e-14,140.2213 -2.84217094e-14,224.5209 C-2.84217094e-14,321.4144 78.84,400.1733 175.734,400.1733 C272.627,400.1733 351.385,321.4144 351.385,224.5209 C351.385,190.5527 341.584,158.8881 324.848,131.9621 L346.127,110.6833 C347.41,109.3561 348.231,107.5295 348.231,105.6664 C348.231,103.8033 347.41,102.057 346.127,100.7313 L324.605,79.1288 C321.871,76.3943 317.388,76.3943 314.653,79.1288 L296.53,97.2523 C273.456,75.3385 244.574,59.5486 212.305,52.672 L212.305,13.9972 L229.78,13.9972 C233.675,13.9972 236.738,10.8544 236.738,6.9584 C236.738,3.1056 233.632,5.68434189e-14 229.78,5.68434189e-14 L212.305,5.68434189e-14 L139.001,5.68434189e-14 L121.606,5.68434189e-14 L121.606,0 Z M153.079,13.9972 L198.307,13.9972 L198.307,50.4064 C190.892,49.4547 183.316,48.7875 175.653,48.7875 C167.989,48.7875 160.495,49.4146 153.079,50.4064 L153.079,13.9972 Z M175.653,62.7854 C264.8,62.7854 337.308,135.3739 337.308,224.5209 C337.308,313.7097 264.8,386.1762 175.653,386.1762 C86.464,386.1762 13.917,313.7097 13.917,224.5209 C13.917,135.3746 86.464,62.7854 175.653,62.7854 Z M319.589,94.0158 L331.239,105.6664 L316.676,120.2306 C313.362,115.7566 309.926,111.5084 306.239,107.3658 L319.589,94.0158 Z M175.653,217.482 C173.862,217.482 172.084,218.2185 170.717,219.5858 C167.983,222.3202 167.983,226.7227 170.717,229.4568 L248.875,307.6141 C250.242,308.9814 251.989,309.634 253.81,309.634 C255.589,309.634 257.417,308.9376 258.827,307.6141 C261.561,304.8796 261.561,300.4771 258.827,297.7431 L180.588,219.5858 C179.222,218.2185 177.445,217.482 175.653,217.482 L175.653,217.482 Z" id="Shape"  fillRule="nonzero"></path>
		    </g>
		</svg>
	);
}

const Hover = ({ onHover, children }) => (
    <div className="hover">
        <div className="hover__no-hover">{children}</div>
        <div className="hover__hover">{onHover}</div>
    </div>
);

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

class PrimaryBtn extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			type: props.type || 'submit',
			text: props.text || 'submit',
		}
	}

	render() {
		return (
			<div className="primary_btn pwp-align-center">
				<button type={this.state.type} className="pwp-display-block">
					{this.state.text}
				</button>
			</div>
		);
	}
}

// TODO
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