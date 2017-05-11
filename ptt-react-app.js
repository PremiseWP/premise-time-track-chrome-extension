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
 * Authenticates our user and saves the site
 * info as a cookie in our browser.
 *
 * @param  {Object} creds the credentials to authenticate user
 * @return {void}
 */
function discoverSite(creds) {
	creds = creds || null;

	if (!creds) {
		console.error('No URL supplied to discover site.');
		return false;
	}

	fetch(creds.url + '/wp-json/').then(function (r) {
		r.json().then(function (s) {
			// save the site info
			PTT.site = s;

			// save the
			PTT.auth = wpApiAuth({
				oauth_consumer_key: creds.key,
				oauth_secret: creds.secret,
				url: creds.api_url,
				urls: s.authentication.oauth1
			});

			PTT.auth.authenticate(function (err, oauth) {
				var view;
				// handle errors first
				if (err) {
					var errMsg = _react2.default.createElement(
						'span',
						{ className: 'error' },
						err.responseText
					);
					view = _react2.default.createElement(Discover, { message: errMsg });
				}
				// No errors! sho the dashboard
				else {
						view = _react2.default.createElement(Dashboard, null);
						Cookies.set('_ptt', creds);
					}

				_reactDom2.default.render(view, document.getElementById('app'));
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
function loadTax(slug, callback) {
	slug = slug || null;

	if (!slug) return false;

	fetch(PTT.site.url + '/wp-json/wp/v2/premise_time_tracker_' + slug + '/').then(function (response) {
		response.json().then(function (_terms) {
			callback(_terms);
		});
	});
}

/**
 * Retrieve a taxonomy from premise time tracker
 *
 * @param  {String} slug the taxonomy slug (wihtout 'premise_time_tracker_')
 * @return {Promise}     Promise for the taxonomy object
 */
function getTax(slug) {
	slug = slug || null;

	if (!slug) return false;

	var _url = PTT.site.url + '/wp-json/wp/v2/premise_time_tracker_' + slug + '/',
	    tax = fetch(_url).then(function (response) {
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
function getPost(id, options) {
	id = id || null;
	options = options || null;

	if (!id) return false;

	// parse options as params
	// BETA not fully tested
	if (options) {
		var _options = '';
		for (var i in options) {
			if (options.hasOwnProperty(i)) {
				_options += '&' + i + '=' + options[i];
			}
		}
		// console.log(_options);
	}

	// fetch the post and return promise
	var tax = fetch(pttEndpoint() + '/' + id + '?' + _options + '/').then(function (response) {
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
	return _react2.default.createElement(
		'svg',
		{ viewBox: '0 0 352 401', version: '1.1', xmlns: 'http://www.w3.org/2000/svg', xmlnsXlink: 'http://www.w3.org/1999/xlink' },
		_react2.default.createElement(
			'g',
			{ id: 'timer_svg', stroke: 'none', strokeWidth: '1', fill: 'none', fillRule: 'evenodd' },
			_react2.default.createElement('path', { d: 'M121.606,0 C117.712,0 114.647,3.1064 114.647,6.9584 C114.647,10.8522 117.754,13.9972 121.606,13.9972 L139.001,13.9972 L139.001,52.672 C59.631,69.573 -2.84217094e-14,140.2213 -2.84217094e-14,224.5209 C-2.84217094e-14,321.4144 78.84,400.1733 175.734,400.1733 C272.627,400.1733 351.385,321.4144 351.385,224.5209 C351.385,190.5527 341.584,158.8881 324.848,131.9621 L346.127,110.6833 C347.41,109.3561 348.231,107.5295 348.231,105.6664 C348.231,103.8033 347.41,102.057 346.127,100.7313 L324.605,79.1288 C321.871,76.3943 317.388,76.3943 314.653,79.1288 L296.53,97.2523 C273.456,75.3385 244.574,59.5486 212.305,52.672 L212.305,13.9972 L229.78,13.9972 C233.675,13.9972 236.738,10.8544 236.738,6.9584 C236.738,3.1056 233.632,5.68434189e-14 229.78,5.68434189e-14 L212.305,5.68434189e-14 L139.001,5.68434189e-14 L121.606,5.68434189e-14 L121.606,0 Z M153.079,13.9972 L198.307,13.9972 L198.307,50.4064 C190.892,49.4547 183.316,48.7875 175.653,48.7875 C167.989,48.7875 160.495,49.4146 153.079,50.4064 L153.079,13.9972 Z M175.653,62.7854 C264.8,62.7854 337.308,135.3739 337.308,224.5209 C337.308,313.7097 264.8,386.1762 175.653,386.1762 C86.464,386.1762 13.917,313.7097 13.917,224.5209 C13.917,135.3746 86.464,62.7854 175.653,62.7854 Z M319.589,94.0158 L331.239,105.6664 L316.676,120.2306 C313.362,115.7566 309.926,111.5084 306.239,107.3658 L319.589,94.0158 Z M175.653,217.482 C173.862,217.482 172.084,218.2185 170.717,219.5858 C167.983,222.3202 167.983,226.7227 170.717,229.4568 L248.875,307.6141 C250.242,308.9814 251.989,309.634 253.81,309.634 C255.589,309.634 257.417,308.9376 258.827,307.6141 C261.561,304.8796 261.561,300.4771 258.827,297.7431 L180.588,219.5858 C179.222,218.2185 177.445,217.482 175.653,217.482 L175.653,217.482 Z', id: 'Shape', fillRule: 'nonzero' })
		)
	);
}

var Hover = function Hover(_ref) {
	var onHover = _ref.onHover,
	    children = _ref.children;
	return _react2.default.createElement(
		'div',
		{ className: 'hover' },
		_react2.default.createElement(
			'div',
			{ className: 'hover__no-hover' },
			children
		),
		_react2.default.createElement(
			'div',
			{ className: 'hover__hover' },
			onHover
		)
	);
};

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
				_react2.default.createElement('i', { className: 'fa fa-spin ' + this.state.icon,
					style: iconStyle })
			);
		}
	}]);

	return LoadingIcon;
}(_react2.default.Component);

var PrimaryBtn = function (_React$Component2) {
	_inherits(PrimaryBtn, _React$Component2);

	function PrimaryBtn(props) {
		_classCallCheck(this, PrimaryBtn);

		var _this2 = _possibleConstructorReturn(this, (PrimaryBtn.__proto__ || Object.getPrototypeOf(PrimaryBtn)).call(this, props));

		_this2.state = {
			type: props.type || 'submit',
			text: props.text || 'submit'
		};
		return _this2;
	}

	_createClass(PrimaryBtn, [{
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				{ className: 'primary_btn pwp-align-center' },
				_react2.default.createElement(
					'button',
					{ type: this.state.type, className: 'pwp-display-block' },
					this.state.text
				)
			);
		}
	}]);

	return PrimaryBtn;
}(_react2.default.Component);

// TODO


var DashboardBox = function (_React$Component3) {
	_inherits(DashboardBox, _React$Component3);

	function DashboardBox(props) {
		_classCallCheck(this, DashboardBox);

		var _this3 = _possibleConstructorReturn(this, (DashboardBox.__proto__ || Object.getPrototypeOf(DashboardBox)).call(this, props));

		_this3.state = {
			title: props.title || '',
			classes: props.classes || '',
			content: props.children || ''
		};

		_this3.toggleBoxContent = _this3.toggleBoxContent.bind(_this3);
		return _this3;
	}

	// toggle box content


	_createClass(DashboardBox, [{
		key: 'toggleBoxContent',
		value: function toggleBoxContent(e) {
			e.preventDefault();
			$(e.target).parents('.dashboard_box').find('.dashboard_box_content').slideToggle('fast');
			return false;
		}
	}, {
		key: 'render',
		value: function render() {
			console.log(this.state.content);
			return _react2.default.createElement(
				'div',
				{ id: this.state.title.toLowerCase(),
					className: 'dashboard_box' + this.state.classes },
				_react2.default.createElement(
					'div',
					{ className: 'dashboard_box_header' },
					_react2.default.createElement(
						'a',
						{ href: '#',
							className: 'dashboard_close_box',
							onClick: this.toggleBoxContent },
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
					this.state.content
				)
			);
		}
	}]);

	return DashboardBox;
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
 * Load the app
 */
var PTTLoad = function (_React$Component) {
	_inherits(PTTLoad, _React$Component);

	function PTTLoad(props) {
		_classCallCheck(this, PTTLoad);

		var _this = _possibleConstructorReturn(this, (PTTLoad.__proto__ || Object.getPrototypeOf(PTTLoad)).call(this, props));

		_this.state = {
			view: _react2.default.createElement(LoadingIcon, null)
		};
		return _this;
	}

	_createClass(PTTLoad, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			console.log(PTT);
			if (window.ptt.auth && window.ptt.auth.authenticated()) {
				console.log('authenticated');
				this.setState({
					view: _react2.default.createElement(Dashboard, null)
				});
			} else if (window.ptt.creds) {
				console.log('not authenticated but we have creds.');
				discoverSite(window.ptt.creds);
			} else {
				console.log('not authenticated, no creds.');
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

	return PTTLoad;
}(_react2.default.Component);
'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PTT = {
	creds: Cookies.getJSON('_ptt')
};

window.ptt = PTT;

// load our app
$(document).ready(function () {
	_reactDom2.default.render(_react2.default.createElement(PTTLoad, null), document.getElementById('app'));
});
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
			site: PTT.site || {},
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
					{ className: 'header' },
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
				_react2.default.createElement(NewTimer, null)
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
 * Displays and handles the form to discover the site and get the user signed in.
 * When finished, it loads the dashboard.
 */
var Discover = function (_React$Component) {
	_inherits(Discover, _React$Component);

	function Discover(props) {
		_classCallCheck(this, Discover);

		var _this = _possibleConstructorReturn(this, (Discover.__proto__ || Object.getPrototypeOf(Discover)).call(this, props));

		_this.state = {
			message: props.message || 'Let\'s find your site and get you authenticated.',
			processing: false
		};

		_this.handleSubmit = _this.handleSubmit.bind(_this);
		return _this;
	}

	_createClass(Discover, [{
		key: 'handleSubmit',
		value: function handleSubmit(e) {
			e.preventDefault();

			// loading icon
			this.setState({ processing: true });

			// get the data form the form
			var data = new FormData(e.target);

			// bild our credentials object
			var creds = {
				url: data.get('site_url'),
				key: data.get('client_key'),
				secret: data.get('client_secret')
			};

			for (var i in creds) {
				if (creds.hasOwnProperty(i)) {
					if (!creds[i].length) {
						this.setState({
							message: _react2.default.createElement(
								'span',
								{ className: 'error' },
								'None of the fields can be empty.'
							),
							processing: false
						});
						return false;
					}
				}
			}

			// discover the site
			discoverSite(creds);
		}
	}, {
		key: 'render',
		value: function render() {
			var view = this.state.processing ? _react2.default.createElement(LoadingIcon, null) : this.theForm();
			return _react2.default.createElement(
				'div',
				{ className: 'discover_module' },
				_react2.default.createElement(
					'div',
					{ className: 'header' },
					_react2.default.createElement(
						'h1',
						null,
						'Premise Time Tracker'
					)
				),
				_react2.default.createElement(
					'div',
					{ className: 'container' },
					_react2.default.createElement(
						'div',
						{ className: 'message' },
						_react2.default.createElement(
							'p',
							null,
							this.state.message
						),
						'Use this as your callback:',
						_react2.default.createElement(
							'pre',
							null,
							_react2.default.createElement(
								'code',
								null,
								window.location.href + 'land.html'
							)
						)
					),
					view
				)
			);
		}

		// returns the form

	}, {
		key: 'theForm',
		value: function theForm() {
			return _react2.default.createElement(
				'div',
				{ className: 'discover_form' },
				_react2.default.createElement(
					'form',
					{ id: 'discover_form', onSubmit: this.handleSubmit },
					_react2.default.createElement(
						'div',
						null,
						_react2.default.createElement(
							'label',
							{ htmlFor: 'site_url' },
							'Site Url'
						),
						_react2.default.createElement('br', null),
						_react2.default.createElement('input', { type: 'url',
							name: 'site_url',
							id: 'site_url' })
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
						_react2.default.createElement('input', { type: 'text',
							name: 'client_key',
							id: 'key' })
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
						_react2.default.createElement('input', { type: 'text',
							name: 'client_secret',
							id: 'secret' })
					),
					_react2.default.createElement(PrimaryBtn, null)
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

		var _this2 = _possibleConstructorReturn(this, (NewTimer.__proto__ || Object.getPrototypeOf(NewTimer)).call(this, props));

		_this2.state = {};

		_this2.state.post = Cookies.getJSON('ptt_current_timer');

		_this2.state.message = _this2.state.post ? _this2.timerStartedMessage(new Date(_this2.state.post.start)) : '';

		_this2.state.view = _this2.state.post ? _react2.default.createElement(StopTimerBtn, { post: _this2.state.post.id,
			onClick: _this2.handleStopTimer.bind(_this2) }) : _react2.default.createElement(NewTimerBtn, { onClick: _this2.handleNewTimer.bind(_this2) });

		// bind events
		_this2.handleNewTimer = _this2.handleNewTimer.bind(_this2);
		_this2.handleStopTimer = _this2.handleStopTimer.bind(_this2);
		return _this2;
	}

	_createClass(NewTimer, [{
		key: 'componentDidMount',
		value: function componentDidMount() {}

		// TODO handle error

	}, {
		key: 'handleNewTimer',
		value: function handleNewTimer(e) {
			e.preventDefault();

			var _this = this;

			// start the timer!
			var _start = new Date();

			$.ajax({
				beforeSend: PTT.auth.ajaxBeforeSend,
				method: 'POST', // create a post. 'GET' retrieves them
				url: pttEndpoint() + '?status=publish&title=Timer in progress create by PTT at ' + _start.toLocaleTimeString()
			}).done(function (post) {
				// save post info in a cookie.
				Cookies.remove('ptt_current_timer');
				Cookies.set('ptt_current_timer', {
					id: post.id,
					start: _start.getTime()
				});

				console.log(post);

				_this.setState({
					post: {
						id: post.id,
						start: _start.getTime()
					},
					view: _react2.default.createElement(StopTimerBtn, { post: post.id,
						onClick: _this.handleStopTimer.bind(_this) }),
					message: _this.timerStartedMessage(_start)
				});
			}).fail(function (err) {
				console.log(err);
				_this.setState({
					message: _react2.default.createElement(
						'span',
						{ className: 'error' },
						'There was an error'
					)
					// TODO test err.responseText();
				});
			});
		}
	}, {
		key: 'handleStopTimer',
		value: function handleStopTimer(e) {
			e.preventDefault();

			var stop = new Date();
			var diff = Math.abs(stop.getTime() - this.state.post.start);
			var minutes = Math.floor(diff / 60000);
			var total = parseFloat(minutes / 60);
			var time = (Math.round(total * 4) / 4).toFixed(2);

			this.setState({
				view: _react2.default.createElement(NewTimerForm, { post: this.state.post.id, total: time }),
				message: 'Congratulations, you finished a task! Enter some information about it here to complete recording your time.'
			});
		}
	}, {
		key: 'timerStartedMessage',
		value: function timerStartedMessage(_date) {
			var time = _date.toLocaleTimeString();
			return _react2.default.createElement(
				'span',
				null,
				'Timer started at:',
				_react2.default.createElement(
					'span',
					{ className: 'time' },
					' ',
					time
				),
				'.',
				_react2.default.createElement('br', null),
				'Time is ticking..'
			);
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				{ id: 'new_timer' },
				_react2.default.createElement(
					'div',
					{ className: 'message' },
					this.state.message
				),
				this.state.view
			);
		}
	}]);

	return NewTimer;
}(_react2.default.Component);

var NewTimerBtn = function (_React$Component2) {
	_inherits(NewTimerBtn, _React$Component2);

	function NewTimerBtn(props) {
		_classCallCheck(this, NewTimerBtn);

		var _this3 = _possibleConstructorReturn(this, (NewTimerBtn.__proto__ || Object.getPrototypeOf(NewTimerBtn)).call(this, props));

		_this3.state = {
			onClick: props.onClick
		};
		return _this3;
	}

	_createClass(NewTimerBtn, [{
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				{ className: 'new_timer_btn' },
				_react2.default.createElement(
					'button',
					{ id: 'new_timer_btn',
						title: 'New Timer',
						onClick: this.state.onClick },
					timerSVG()
				)
			);
		}
	}]);

	return NewTimerBtn;
}(_react2.default.Component);

var StopTimerBtn = function (_React$Component3) {
	_inherits(StopTimerBtn, _React$Component3);

	function StopTimerBtn(props) {
		_classCallCheck(this, StopTimerBtn);

		var _this4 = _possibleConstructorReturn(this, (StopTimerBtn.__proto__ || Object.getPrototypeOf(StopTimerBtn)).call(this, props));

		_this4.state = {
			onClick: props.onClick
		};

		return _this4;
	}

	_createClass(StopTimerBtn, [{
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				{ className: 'stop_timer_btn' },
				_react2.default.createElement(
					'button',
					{ id: 'stop_timer_btn',
						title: 'Stop Timer',
						onClick: this.state.onClick },
					timerSVG()
				)
			);
		}
	}]);

	return StopTimerBtn;
}(_react2.default.Component);

/**
 *
 */


var NewTimerForm = function (_React$Component4) {
	_inherits(NewTimerForm, _React$Component4);

	function NewTimerForm(props) {
		_classCallCheck(this, NewTimerForm);

		var _this5 = _possibleConstructorReturn(this, (NewTimerForm.__proto__ || Object.getPrototypeOf(NewTimerForm)).call(this, props));

		_this5.state = {
			view: 'show',
			loading: '',
			post: null, // the current post we are wokring with
			projects: _react2.default.createElement(LoadingIcon, null),
			clients: _react2.default.createElement(LoadingIcon, null),
			form: {
				action: pttEndpoint(),
				status: 'publish',
				id: props.post || '',
				time: props.total || '',
				title: '',
				content: '',
				client: '',
				project: ''
			}
		};

		// bind submit event
		_this5.handleSubmit = _this5.handleSubmit.bind(_this5);
		_this5.loadClients = _this5.loadClients.bind(_this5);
		_this5.loadProjects = _this5.loadProjects.bind(_this5);
		_this5.updateFieldValue = _this5.updateFieldValue.bind(_this5);
		return _this5;
	}

	_createClass(NewTimerForm, [{
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				{ className: 'new_timer_form' },
				this.state.loading,
				_react2.default.createElement(
					'form',
					{ className: this.state.view,
						action: this.state.form.action,
						method: 'post',
						onSubmit: this.handleSubmit },
					_react2.default.createElement('input', { type: 'hidden',
						name: 'status',
						value: this.state.form.status }),
					_react2.default.createElement('input', { type: 'hidden',
						name: 'id',
						value: this.state.form.id }),
					_react2.default.createElement(
						'div',
						{ className: 'basic_fields' },
						_react2.default.createElement(
							'div',
							{ className: 'premise-field' },
							_react2.default.createElement(
								'label',
								{ htmlFor: 'pwptt_hours' },
								'Time'
							),
							_react2.default.createElement('br', null),
							_react2.default.createElement('input', { type: 'text', name: 'pwptt_hours', id: 'pwptt_hours', defaultValue: this.state.form.time })
						),
						_react2.default.createElement(
							'div',
							{ className: 'premise-field' },
							_react2.default.createElement(
								'label',
								{ htmlFor: 'title' },
								'Title'
							),
							_react2.default.createElement('br', null),
							_react2.default.createElement('input', { type: 'text', name: 'title', id: 'title',
								value: this.state.form.title,
								onChange: this.updateFieldValue })
						),
						_react2.default.createElement(
							'div',
							{ className: 'span12 premise-field' },
							_react2.default.createElement(
								'label',
								{ htmlFor: 'content' },
								'Description'
							),
							_react2.default.createElement('br', null),
							_react2.default.createElement('textarea', { name: 'content', id: 'content',
								value: this.state.form.content,
								onChange: this.updateFieldValue })
						)
					),
					_react2.default.createElement(
						'div',
						{ className: 'clients' },
						_react2.default.createElement(
							'h3',
							null,
							'Clients'
						),
						this.state.clients
					),
					_react2.default.createElement(
						'div',
						{ className: 'projects' },
						_react2.default.createElement(
							'h3',
							null,
							'Projects'
						),
						this.state.projects
					),
					_react2.default.createElement(PrimaryBtn, null)
				)
			);
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this6 = this;

			// if we have a form id, the lets get the post before loading the form
			if (this.state.form.id) {
				// get the post and save it
				this.state.post = getPost(this.state.form.id);
				this.state.post.then(function (_p) {
					// build form before showing it
					var buildForm = Object.assign(_this6.state.form, {
						title: _p.title.rendered,
						content: _p.content.rendered,
						client: _p.premise_time_tracker_client.length ? _p.premise_time_tracker_client.split(',') : '',
						project: _p.premise_time_tracker_project.length ? _p.premise_time_tracker_project.split(',') : ''
					});
					_this6.setState({
						form: buildForm
					});
					console.log('form should be built');
				});
			}

			this.loadClients();
			this.loadProjects();
		}
	}, {
		key: 'updateFieldValue',
		value: function updateFieldValue(e) {
			var newState = {};
			newState[e.target.name] = e.target.value;
			this.setState({
				form: Object.assign(this.state.form, newState)
			});
		}
	}, {
		key: 'handleSubmit',
		value: function handleSubmit(e) {
			e.preventDefault();

			$('body').animate({ scrollTop: 0 }, 400);

			// reference 'this' and show the loading icon
			var _this = this;
			_this.setState({
				loading: _react2.default.createElement(LoadingIcon, null),
				view: 'hide'
			});

			var fields = $(e.target).serializeArray(),
			    query = e.target.action,
			    parser = '',
			    id;
			// parse fields
			for (var i = fields.length - 1; i >= 0; i--) {
				// exclude id or empty values
				if ('id' !== fields[i].name && fields[i].value.length) {
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
			$.ajax({
				url: query,
				method: 'POST',
				beforeSend: PTT.auth.ajaxBeforeSend
			}).done(function (response) {
				// we were successful!
				console.log(response);
				// delete post cookie
				Cookies.remove('ptt_current_timer');
				// reload because we cannot update the view.
				// TODO fix this!
				location.reload();
			}).fail(function (err) {
				console.error(err);
				_this.setState({
					message: _react2.default.createElement(
						'span',
						{ className: 'error' },
						'There was an error'
					)
					// TODO test err.responseText();
				});
			});
		}
	}, {
		key: 'listTax',
		value: function listTax(terms) {

			var list = [];
			for (var i = terms.length - 1; i >= 0; i--) {
				list.push(_react2.default.createElement(
					'li',
					{ key: terms[i].id, className: 'taxonomy_field' },
					_react2.default.createElement(
						'label',
						{ htmlFor: terms[i].taxonomy + '_' + terms[i].id },
						_react2.default.createElement('input', { type: 'radio',
							name: terms[i].taxonomy,
							value: terms[i].id,
							id: terms[i].taxonomy + '_' + terms[i].id }),
						_react2.default.createElement(
							'span',
							null,
							terms[i].name
						)
					)
				));
			}

			var ul = _react2.default.createElement(
				'ul',
				null,
				list
			);
			return ul;
		}
	}, {
		key: 'theForm',
		value: function theForm(_form) {
			// this.state.form = Object.assign( this.state.form, _form );
			// return(

			// );
		}
	}, {
		key: 'loadClients',
		value: function loadClients() {
			var _this7 = this;

			console.log('loading clients');
			getTax('client').then(function (clients) {
				_this7.state.clients = _this7.listTax(clients);
				_this7.setState({
					// clients: list,
					view: _this7.theForm()
				});
			});
		}
	}, {
		key: 'loadProjects',
		value: function loadProjects() {
			var _this8 = this;

			console.log('loading projects');
			getTax('project').then(function (projects) {
				_this8.setState({
					projects: _this8.listTax(projects)
				});
			});
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
			taxURL: PTT.site.url + '/wp-json/wp/v2/' + props.slug + '/' };

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

			fetch(PTT.site.url + '/wp-json/wp/v2/premise_time_tracker/?per_page=100&' + this.state.slug + '=' + _id).then(function (r) {
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
