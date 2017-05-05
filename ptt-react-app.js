'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Authenticate with the WP API and save the cookie for credentials used
 *
 * @param  {Object}   creds    the credentials to use for authentication
 * @param  {Function} callback A callback function to call after authentication.
 *                             Return the authentication object as 'this' argument
 * @return {void}              does not return anything. saves cookie and calls callback function.
 */
function authenticate(creds, callback) {
	creds = creds || {};

	var _auth = {};

	if (creds.api_url) {
		// verify the site and get authorized.
		fetch(creds.api_url, {
			method: 'GET',
			mode: 'cors'
		}).then(function (resp) {
			resp.json().then(function (site) {
				// save the site
				_auth.site = site;
				// get authorized and save the data
				_auth.auth = wpApiAuth({
					oauth_consumer_key: creds.key,
					oauth_secret: creds.secret,
					url: creds.api_url,
					urls: _auth.site.authentication.oauth1
				});

				Cookies.set('ptt_creds', creds);

				window.PTT = _auth;

				if (callback && 'function' == typeof callback) {
					callback.call(_auth);
				}
			});
		});
	}
}

/**
 * Display a loading icon
 */

var LoadingIcon = function (_React$Component) {
	_inherits(LoadingIcon, _React$Component);

	function LoadingIcon(props) {
		_classCallCheck(this, LoadingIcon);

		var _this = _possibleConstructorReturn(this, (LoadingIcon.__proto__ || Object.getPrototypeOf(LoadingIcon)).call(this, props));

		_this.state = {
			size: '3em',
			icon: 'fa-spinner',
			align: 'center'
		};
		return _this;
	}

	_createClass(LoadingIcon, [{
		key: 'render',
		value: function render() {
			var divStyle = {
				textAlign: this.state.align
			};

			var iconStyle = {
				fontSize: this.state.size
			};

			return _react2.default.createElement(
				'div',
				{ className: 'loading_icon', style: divStyle },
				_react2.default.createElement('i', { className: 'fa fa-spin ' + this.state.icon, style: iconStyle })
			);
		}
	}]);

	return LoadingIcon;
}(_react2.default.Component);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// var WPAPI = require( 'wpapi' );

$(document).ready(function () {
	// Load it! when document is ready
	_reactDom2.default.render(_react2.default.createElement(LoadPTT, null), document.getElementById('app'));
});

/**
 * Load the timer dashboard or discover view.
 *
 * if the creds are saved in a cookie it attempts to load the dashboard using those credentials.
 * Otherwise, it loads the Discover view to begin authentication.
 */

var LoadPTT = function (_React$Component) {
	_inherits(LoadPTT, _React$Component);

	function LoadPTT(props) {
		_classCallCheck(this, LoadPTT);

		var _this2 = _possibleConstructorReturn(this, (LoadPTT.__proto__ || Object.getPrototypeOf(LoadPTT)).call(this, props));

		_this2.state = {
			creds: Cookies.getJSON('ptt_creds') || {},
			view: _react2.default.createElement(LoadingIcon, null)
		};
		return _this2;
	}

	_createClass(LoadPTT, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			if (Object.keys(this.state.creds).length > 0) {

				var _this = this;
				authenticate(this.state.creds, function () {
					_this.setState({ view: _react2.default.createElement(Dashboard, { site: this.site }) });
				});
			} else {
				this.setState({
					view: _react2.default.createElement(Discover, null)
				});
			}
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				null,
				this.state.view
			);
		}
	}]);

	return LoadPTT;
}(_react2.default.Component);

;
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Display the dashboard
 */
var Dashboard = function (_React$Component) {
	_inherits(Dashboard, _React$Component);

	function Dashboard(props) {
		_classCallCheck(this, Dashboard);

		var _this = _possibleConstructorReturn(this, (Dashboard.__proto__ || Object.getPrototypeOf(Dashboard)).call(this, props));

		_this.state = {
			site: props.site,
			taxonomies: [{
				slug: 'premise_time_tracker_client',
				title: 'Clients'
			}, {
				slug: 'premise_time_tracker_project',
				title: 'Projects'
			}]
		};
		return _this;
	}

	_createClass(Dashboard, [{
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				{ id: 'dashboard' },
				_react2.default.createElement(
					'div',
					{ className: 'dashboard_header' },
					_react2.default.createElement(
						'h1',
						null,
						this.state.site.name
					),
					_react2.default.createElement(
						'span',
						null,
						this.state.site.description
					)
				),
				_react2.default.createElement(NewTimer, null),
				this.loadTaxonomies()
			);
		}

		/**
   * load taxonomies in dashboard boxes
   */

	}, {
		key: 'loadTaxonomies',
		value: function loadTaxonomies() {
			var taxs = [];
			for (var i = this.state.taxonomies.length - 1; i >= 0; i--) {
				taxs.push(_react2.default.createElement(LoadTaxonomy, {
					slug: this.state.taxonomies[i].slug,
					title: this.state.taxonomies[i].title,
					key: i }));
			}
			return taxs;
		}
	}]);

	return Dashboard;
}(_react2.default.Component);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Discover View
 *
 * This view lets us discover the site that want to work with
 * and authenticate our user. When finished, it loads the dashboard.
 */
var Discover = function (_React$Component) {
	_inherits(Discover, _React$Component);

	function Discover(props) {
		_classCallCheck(this, Discover);

		var _this = _possibleConstructorReturn(this, (Discover.__proto__ || Object.getPrototypeOf(Discover)).call(this, props));

		_this.state = { creds: {}, site: {}, auth: {} };

		_this.handleSubmit = _this.handleSubmit.bind(_this);
		return _this;
	}

	_createClass(Discover, [{
		key: 'handleSubmit',
		value: function handleSubmit(e) {
			e.preventDefault();

			// get the data form the form
			var data = new FormData(e.target);

			// save our credentials
			this.state.creds = {
				url: data.get('site_url'),
				key: data.get('client_key'),
				secret: data.get('client_secret')
			};

			// needs to be cleaned up to check if url already has wp-json
			this.state.creds.api_url = this.state.creds.url + '/wp-json/';

			// authenticate, save cookie, and load dashboard.
			authenticate(this.state.creds, function () {
				var auth = this;
				_reactDom2.default.render(_react2.default.createElement(Dashboard, { site: auth.site }), document.getElementById('app'));
			});
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement(
					'form',
					{ onSubmit: this.handleSubmit },
					_react2.default.createElement(
						'div',
						null,
						_react2.default.createElement(
							'label',
							{ htmlFor: 'site_url' },
							'Site Url'
						),
						_react2.default.createElement('br', null),
						_react2.default.createElement('input', { type: 'url', name: 'site_url', id: 'site_url', defaultValue: 'http://time.vallgroup.com' })
					),
					_react2.default.createElement(
						'div',
						null,
						_react2.default.createElement(
							'label',
							{ htmlFor: 'client_key' },
							'Client Key'
						),
						_react2.default.createElement('br', null),
						_react2.default.createElement('input', { type: 'text', name: 'client_key', id: 'key', defaultValue: 'zyzSVcThUzvr' })
					),
					_react2.default.createElement(
						'div',
						null,
						_react2.default.createElement(
							'label',
							{ htmlFor: 'client_secret' },
							'Client Secret'
						),
						_react2.default.createElement('br', null),
						_react2.default.createElement('input', { type: 'text', name: 'client_secret', id: 'secret', defaultValue: 'kvdxdEEZjIsJfM6fZOHhbC0etrPBVXvotfoh0JiCzBCHhgSN' })
					),
					_react2.default.createElement('input', { type: 'submit' })
				)
			);
		}
	}]);

	return Discover;
}(_react2.default.Component);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Display the new timer button
 */
var NewTimer = function (_React$Component) {
	_inherits(NewTimer, _React$Component);

	function NewTimer(props) {
		_classCallCheck(this, NewTimer);

		var _this = _possibleConstructorReturn(this, (NewTimer.__proto__ || Object.getPrototypeOf(NewTimer)).call(this, props));

		_this.handleClick = _this.handleClick.bind(_this);

		_this.state = {
			view: ''
		};

		return _this;
	}

	_createClass(NewTimer, [{
		key: 'handleClick',
		value: function handleClick(e) {
			e.preventDefault();

			this.setState({
				view: _react2.default.createElement(NewTimerForm, null)
			});
		}
	}, {
		key: 'render',
		value: function render() {
			if ('' == this.state.view) {
				this.state.view = _react2.default.createElement(
					'button',
					{ id: 'new_timer_btn', className: 'start_timer', onClick: this.handleClick, title: 'New Timer' },
					_react2.default.createElement('i', { className: 'fa fa-clock-o' })
				);
			}

			return _react2.default.createElement(
				'div',
				{ id: 'new_timer' },
				this.state.view
			);
		}
	}]);

	return NewTimer;
}(_react2.default.Component);

/**
 *
 */


var NewTimerForm = function (_React$Component2) {
	_inherits(NewTimerForm, _React$Component2);

	function NewTimerForm(props) {
		_classCallCheck(this, NewTimerForm);

		var _this2 = _possibleConstructorReturn(this, (NewTimerForm.__proto__ || Object.getPrototypeOf(NewTimerForm)).call(this, props));

		_this2.state = {
			creds: Cookies.getJSON('ptt_creds')
		};

		_this2.handleSubmit = _this2.handleSubmit.bind(_this2);
		return _this2;
	}

	_createClass(NewTimerForm, [{
		key: 'handleSubmit',
		value: function handleSubmit(e) {
			e.preventDefault();

			console.log(e.target.action);
			// get the data form the form
			var data = new FormData(e.target);

			var options = {
				url: e.target.action,
				method: e.target.method
			};

			var headers = new Headers();

			// headers.append( 'Authorize', window.PTT.auth.serialize() );

			fetch(e.target.action, {
				method: e.target.method,
				headers: headers,
				data: data
			}).then(function (r) {
				console.log(r);
			});
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				{ className: 'dashboard_box new_timer_form' },
				_react2.default.createElement(
					'form',
					{ action: this.state.creds.api_url + 'wp/v2/premise_time_tracker', method: 'post', onSubmit: this.handleSubmit },
					_react2.default.createElement(
						'div',
						{ className: 'pwp-row not-responsive' },
						_react2.default.createElement(
							'div',
							{ className: 'col2 premise-field' },
							_react2.default.createElement(
								'label',
								{ htmlFor: 'title' },
								'Title'
							),
							_react2.default.createElement('br', null),
							_react2.default.createElement('input', { type: 'text', name: 'title', id: 'title' })
						),
						_react2.default.createElement(
							'div',
							{ className: 'col2 premise-field' },
							_react2.default.createElement(
								'label',
								{ htmlFor: 'pwptt_hours' },
								'Time'
							),
							_react2.default.createElement('br', null),
							_react2.default.createElement('input', { type: 'number', name: 'pwptt_hours', id: 'pwptt_hours' })
						),
						_react2.default.createElement(
							'div',
							{ className: 'span12 premise-field' },
							_react2.default.createElement(
								'label',
								{ htmlFor: 'pwptt_hours' },
								'Time'
							),
							_react2.default.createElement('br', null),
							_react2.default.createElement('textarea', { name: 'pwptt_hours', id: 'pwptt_hours' })
						)
					),
					_react2.default.createElement(
						'div',
						{ className: 'new_timer_form_submit pwp-align-center' },
						_react2.default.createElement('input', { className: 'pwp-display-block', type: 'submit' })
					)
				)
			);
		}
	}]);

	return NewTimerForm;
}(_react2.default.Component);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Load a taxonomy in the dashboard.
 */
var LoadTaxonomy = function (_React$Component) {
	_inherits(LoadTaxonomy, _React$Component);

	function LoadTaxonomy(props) {
		_classCallCheck(this, LoadTaxonomy);

		var _this = _possibleConstructorReturn(this, (LoadTaxonomy.__proto__ || Object.getPrototypeOf(LoadTaxonomy)).call(this, props));

		_this.state = {
			posts: [],
			view: _react2.default.createElement(LoadingIcon, null),
			title: props.title || '',
			slug: props.slug || '',
			taxURL: window.PTT.site.url + '/wp-json/wp/v2/' + props.slug + '/' };

		_this.loadTaxonomy = _this.loadTaxonomy.bind(_this);
		_this.closeTaxonomy = _this.closeTaxonomy.bind(_this);
		_this.toggleBoxContent = _this.toggleBoxContent.bind(_this);
		return _this;
	}

	// show the project module


	_createClass(LoadTaxonomy, [{
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				{ id: this.state.title.toLowerCase(), className: 'dashboard_box' },
				_react2.default.createElement(
					'div',
					{ className: 'dashboard_box_header' },
					_react2.default.createElement(
						'a',
						{ href: '#', className: 'dashboard_close_box', onClick: this.toggleBoxContent },
						_react2.default.createElement('i', { className: 'fa fa-caret-up' })
					),
					_react2.default.createElement(
						'h3',
						null,
						this.state.title
					)
				),
				_react2.default.createElement(
					'div',
					{ className: 'dashboard_box_content' },
					this.state.view
				)
			);
		}

		// Once loaded, ajax for projects

	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this2 = this;

			// get projects list
			fetch(this.state.taxURL).then(function (response) {
				response.json().then(function (_terms) {
					// prepare the list of projects
					var list = [];
					for (var i = _terms.length - 1; i >= 0; i--) {
						list.push(_react2.default.createElement(
							'li',
							{ className: 'tax_li', key: _terms[i].id },
							_react2.default.createElement(
								'a',
								{ href: '#',
									onClick: _this2.loadTaxonomy,
									'data-tax-id': _terms[i].id,
									'data-tax-name': _terms[i].name,
									'data-tax-count': _terms[i].count },
								_terms[i].name
							)
						));
					}
					// wrap the list before inserting it
					// and save it to our state object
					_this2.state.posts = _react2.default.createElement(
						'ul',
						{ className: 'taxonomy_list' },
						list
					);
					// update the UI
					_this2.setState({ view: _this2.state.posts });
				});
			});
		}

		// load a new project

	}, {
		key: 'loadTaxonomy',
		value: function loadTaxonomy(e) {
			var _this3 = this;

			e.preventDefault();

			this.setState({ view: _react2.default.createElement(LoadingIcon, null) });

			var _id = e.target.getAttribute('data-tax-id');

			fetch(window.PTT.site.url + '/wp-json/wp/v2/premise_time_tracker/?per_page=100&' + this.state.slug + '=' + _id).then(function (r) {
				r.json().then(function (timers) {

					var list = [];
					var total = '0.00';
					for (var i = timers.length - 1; i >= 0; i--) {
						list.push(_react2.default.createElement(
							'li',
							{ className: 'timer_li', key: timers[i].id },
							_react2.default.createElement(
								'span',
								{ className: 'time' },
								timers[i].pwptt_hours
							),
							_react2.default.createElement(
								'h2',
								null,
								timers[i].title.rendered
							),
							_react2.default.createElement('p', { className: 'description', dangerouslySetInnerHTML: { __html: timers[i].content.rendered } })
						));
						total = +total + +timers[i].pwptt_hours;
					}
					// wrap the list before inserting it
					// and save it to our state object
					var ul = _react2.default.createElement(
						'div',
						{ className: 'taxonomy_view' },
						_react2.default.createElement(
							'div',
							{ className: 'close_taxonomy' },
							_react2.default.createElement(
								'a',
								{ href: '#', onClick: _this3.closeTaxonomy },
								_react2.default.createElement('i', { className: 'fa fa-close' })
							)
						),
						_react2.default.createElement(
							'div',
							{ className: 'timers_loop' },
							_react2.default.createElement(
								'span',
								null,
								'Total: ',
								total
							),
							_react2.default.createElement(
								'ul',
								{ className: 'timers_list' },
								list
							),
							_react2.default.createElement(
								'span',
								null,
								'Total: ',
								total
							)
						)
					);
					// update the UI
					_this3.setState({ view: ul });
				});
			});
		}

		// close a project and show back the list

	}, {
		key: 'closeTaxonomy',
		value: function closeTaxonomy(e) {
			e.preventDefault();

			this.setState({ view: this.state.posts });
		}

		// toggle box content

	}, {
		key: 'toggleBoxContent',
		value: function toggleBoxContent(e) {
			e.preventDefault();
			$(e.target).parents('.dashboard_box').find('.dashboard_box_content').slideToggle('fast');
			return false;
		}
	}]);

	return LoadTaxonomy;
}(_react2.default.Component);
